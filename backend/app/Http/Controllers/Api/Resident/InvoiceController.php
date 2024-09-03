<?php


namespace App\Http\Controllers\Api\Resident;


use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Requests\Resident\Invoices\InvoiceListRequest;
use App\Http\Requests\Resident\Invoices\InvoicePriceCalcRequest;
use App\Http\Requests\Resident\Invoices\InvoiceRequest;
use App\Http\Resources\Resident\Client\ClientResource;
use App\Http\Resources\Resident\Invoices\InvoiceExcelResource;
use App\Http\Resources\Resident\Invoices\InvoiceListResource;
use App\Http\Resources\Resident\Invoices\InvoicePdfResource;
use App\Http\Resources\Resident\Settings\CurrencyResorce;
use App\Http\Resources\Resident\Settings\TaxResorce;
use App\Models\Config;
use App\Models\Resident\Invoices\Invoice;
use App\Models\Resident\Settings\Currency;
use App\Models\Resident\Settings\Tax;
use App\Models\Users\Client;
use App\Services\Document\DocumentVariables;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class InvoiceController extends ResidentController
{
    use CRUD{
        createOrUpdate as createOrUpdateCRUD;
    }

    public function stat()
    {
        #ДОСТУП

        $stat = Invoice::smallStat();

        foreach($stat as &$value) {
            $column = $value['status'] == 'Partially Paid' ? 'credit' : 'total';
            $total = 0;
            $value['build']->get()->each(function($item) use($column, &$total){
                $total += $item->transformPrice($column);
            });
            $value['total'] = (new Invoice())->setCurrency()->printPrice($total);
            unset($value['build']);
        }

        return response()->json(['data' => $stat]);

    }

    public function getDocumentVariables(): DocumentVariables
    {
        $columns = [
            'code' => 'Code',
            'account' => 'Name and Company name',
            'amount' => 'Amount',
            'invoiceDate' => 'Invoice date',
            'dueDate' => 'Due date',
            'status' => 'Status',
            'type' => 'Type',
        ];

        $varibles = new DocumentVariables();

        $varibles->nameDocument = "Invoice";
        $varibles->header = "Invoice - Infiniti";
        $varibles->columns = $columns;
        $varibles->excelView = 'document.excel.resident-invoice';
        $varibles->resource = request()->input('document') == 'pdf' ? InvoicePdfResource::class : InvoiceExcelResource::class;


        return $varibles;
    }

    public function list(InvoiceListRequest $request)
    {

        #ДОСТУП

        $invoice = Invoice::query()
            ->select('sys_invoices.*')
            ->leftJoin('crm_accounts', 'crm_accounts.id', '=', 'sys_invoices.userid')
            ->leftJoin('sys_companies', 'sys_companies.id', '=', 'crm_accounts.cid')
            ->with(['user', 'user.companyClient', 'user.group']);

        $requestAll = $request->all();

        if($status = Arr::get($requestAll, 'filter.status')) {
            $invoice->where('sys_invoices.status', $status);
        }

        if(($search = Arr::get($requestAll, 'filter.search')) !== null) {
            $invoice->where(function($q) use ($search){
                $search = "%" . $search . "%";
                $q->where('sys_invoices.id', 'like', $search)
                    ->orWhere(DB::raw("CONCAT(`sys_invoices`.`invoicenum`, '', IF(`sys_invoices`.`cn` != '', `sys_invoices`.`cn`, `sys_invoices`.`id`))"), 'like', $search)
                    ->orWhere('crm_accounts.account', 'like', $search)
                    ->orWhere('sys_companies.company_name', 'like', $search)
                    ->orWhere('sys_invoices.total', 'like', $search)
                    ->orWhere(DB::raw("DATE_FORMAT(`sys_invoices`.`date`, '%d/%m/%Y')"), 'like', $search)
                    ->orWhere(DB::raw("DATE_FORMAT(`sys_invoices`.`duedate`, '%d/%m/%Y')"), 'like', $search);
            });
        }

        $request->sortModel($invoice);

        return $this->index($invoice, InvoiceListResource::class, true);
    }

    public function inputData()
    {
        $dueDate = [];
        foreach(InvoiceRequest::DUEDATE as $key => $val) {
            $dueDate[$key] = trans_choice("numerals.repeat.day", $val, ['day' => $val]);
        }
        return response()->json([
            'client' => ClientResource::collection(Client::getForSelect()),
            'status' => array_keys(InvoiceRequest::STATUS),
            'currency' => CurrencyResorce::collection(Currency::getForSelect()),
            'num' => Invoice::getNextNum(),
            'invoiceNum' => Config::get('invoice_code_prefix', 'INV-'),
            'repeat' => Invoice::getRepeatName(),
            'dueDate' => $dueDate,
            'tax' => TaxResorce::collection(Tax::getForSelect()),
            'notes' => Config::get('invoice_terms')
        ]);
    }

    public function priceCalc(InvoicePriceCalcRequest $request)
    {
        $result = [];
        $sum = [0,0,0,0];
        foreach($request->getPriceList() as $key => $value) {
            $class = InvoicePriceCalcRequest::TYPE[$value['type']];
            if(class_exists($class)) {
                $price = 0;
                $discount = 0;
            } else {
                $price = round(intval($value['amount'] ?? 0) * ($value['price'] ?? 0), 2);
                $discount =  round($request->discount($price, $value['discountType'] ?? null, $value['discount'] ?? null), 2);
            }

            $total = round($price - $discount, 2);

            if(isset($value['tax'])) {
                $taxModel = Tax::findOrFail($value['tax']);
                $tax = $taxModel->getTaxPrice($total);
            } else {
                $tax = 0;
            }

            $total += $tax;
            $result[$key]['total'] = $total;

            $sum[0] += $price;
            $sum[1] += $discount;
            $sum[2] += $tax;
            $sum[3] += $total;

        }

        if($request->currency) {
            $currency = Currency::where('iso_code', $request->currency)->first();
            foreach($sum as &$val) {
                $val = (new Invoice())->printPrice($val, $currency);
            }
        }

        return response()->json(['data' => $result, 'result' => array_combine(['price', 'discount', 'tax', 'total'], $sum)]);
    }

    public function createOrUpdate(InvoiceRequest $request, Invoice $invoice)
    {
        return $this->createOrUpdateCRUD(
            $request,
            $invoice,
            function($model, $request, $isNew){

                if($isNew) {
                    $model->setApiToken();
                }
                /**
                 * @var Client $model
                 */
                if($request->password) {
                    $model->setNewPassword($request->password);
                }

                if($request->currency) {
                    $cur = Currency::where('iso_code', $request->currency)->first();
                    $model->currency = $cur->id;
                }

                if($request->country) {
                    $countryList = Countries::list();
                    $model->country = $countryList[$request->country];
                }
            },
            function($model, $request, $isNew){
                if($isNew) {
                    Log::send(__('resident.newContact', ['name' => $model->account, 'id' => $model->id]));
                }

                if($request->customFields) {
                    $data = [];
                    foreach($request->customFields as $id => $value) {
                        $data[$id] = ['fvalue' => $value];
                    }
                    $model->customFieldsValues()->sync($data);
                }


                if($request->tags) {
                    $model->setTag($request->tags);
                }
            }
        );
    }


}
