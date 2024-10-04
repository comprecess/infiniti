<?php


namespace App\Http\Controllers\Api\Resident;


use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Requests\Resident\Invoices\InvoiceBlankRequest;
use App\Http\Requests\Resident\Invoices\InvoiceListRequest;
use App\Http\Requests\Resident\Invoices\InvoicePriceCalcRequest;
use App\Http\Requests\Resident\Invoices\InvoiceRequest;
use App\Http\Resources\Resident\Client\ClientResource;
use App\Http\Resources\Resident\Invoices\InvoiceBlankResource;
use App\Http\Resources\Resident\Invoices\InvoiceExcelResource;
use App\Http\Resources\Resident\Invoices\InvoiceItemResource;
use App\Http\Resources\Resident\Invoices\InvoiceListResource;
use App\Http\Resources\Resident\Invoices\InvoicePdfResource;
use App\Http\Resources\Resident\Invoices\InvoiceResource;
use App\Http\Resources\Resident\Invoices\OfferItemResource;
use App\Http\Resources\Resident\Settings\CurrencyResorce;
use App\Http\Resources\Resident\Settings\TaxResorce;
use App\Models\Config;
use App\Models\Contracts\ModelServiceInterface;
use App\Models\Resident\Invoices\Invoice;
use App\Models\Resident\Invoices\InvoiceItem;
use App\Models\Resident\Invoices\Offer;
use App\Models\Resident\Settings\Currency;
use App\Models\Resident\Settings\Tax;
use App\Models\Users\Client;
use App\Services\Document\DocumentVariables;
use Carbon\Carbon;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class InvoiceController extends ResidentController
{
    use CRUD{
        createOrUpdate as createOrUpdateCRUD;
        delete as deleteCRUD;
    }

    const PUBLIC_TOKEN = [
        'invoice' => [
          'model' => Invoice::class,
          'resource' => InvoiceItemResource::class
        ],
        'offer' => [
            'model' => Offer::class,
            'resource' => OfferItemResource::class
        ],
    ];

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
            'notes' => Config::get('invoice_terms'),
            'service' => InvoicePriceCalcRequest::getService()->keys()
        ]);
    }

    public function priceCalc(InvoicePriceCalcRequest $request)
    {
        list($sum, $result) = InvoiceItem::blankCalc($request);

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

        $requestCalc = app(InvoicePriceCalcRequest::class);
        list($sum, $result) = InvoiceItem::blankCalc($requestCalc);

        return $this->createOrUpdateCRUD(
            $request,
            $invoice,
            function($model, $request, $isNew) use($sum){

                $date = Carbon::createFromFormat('Y-m-d', $request->date);
                $model->date = $date;

                if(isset(InvoiceRequest::DUEDATE[$request->dueDate])) {
                    $model->duedate = $date->copy()->addDays(InvoiceRequest::DUEDATE[$request->dueDate]);
                } else {
                    $model->duedate = $date;
                }

                if(isset(Invoice::REPEAT[$request->repeat])) {
                    $repeat = Invoice::REPEAT[$request->repeat];
                    $method = 'add'. ucfirst($repeat[0]) . 's';
                    $model->nd = $date->copy()->{$method}($repeat[1]);
                    $model->r = "+" . $repeat[1] . " " . $repeat[0];
                }else{
                    $model->nd = $date;
                    $model->r = 0;
                }

                if($request->currency) {
                    $cur = Currency::where('iso_code', $request->currency)->first();
                    $model->currency = $cur->id;
                }

                $model->invoicenum = $request->invoiceNum ? $request->invoiceNum : Config::get('invoice_code_prefix', 'INV-');
                $model->cn = $request->num ? $request->num : '';
                $model->notes = $request->notes ? $request->notes : '';
                $model->subtotal = $sum[0];
                $model->discount = $sum[1];
                $model->total = $sum[3];
                $model->tax = $sum[2];
                if($request->status && isset(InvoiceRequest::STATUS[$request->status])) {
                    $model->status = InvoiceRequest::STATUS[$request->status];
                }
                $model->aid = auth()->id();

                if($request->protjectId) {
                    $model->pid = $request->protjectId;
                }


                if($isNew) {
                    $model->is_same_state = 1;
                    foreach(['vtoken', 'ptoken'] as $name) {
                        $model->setRandomNum($name, 10, true);
                    }
                    $model->datepaid = now();
                }
            },
            function($model, $request, $isNew) use ($result, $requestCalc){
                InvoiceItem::createOrUpdate($requestCalc, $model);
            }
        );
    }

    public function listService($service)
    {
        $service = InvoicePriceCalcRequest::getService()->get($service);
        if(!($service && class_exists($service))){
            abort(404);
        }
        $model = new $service();
        if(!$model instanceof ModelServiceInterface) {
            abort(404);
        }

        return $model->getServiceResources()::collection((new $service)->getServiceData() ?? $service::all());
    }

    public function item(Invoice $invoice)
    {
        return new InvoiceItemResource($invoice->load(['items', 'items.service', 'items.document']));
    }

    public function invoiceClone(Invoice $invoice)
    {
        $new = $invoice->replicate();
        $new->status = Invoice::STATUS[0];
        $new->cn = Invoice::getNextNum();
        foreach(['vtoken', 'ptoken'] as $name) {
            $new->setRandomNum($name, 10, true);
        }
        $new->save();

        $invoice->items->each(function($item) use($new){
            $newItem = $item->replicate();
            $newItem->invoiceid = $new->id;
            $newItem->document_id = $new->id;
            $newItem->save();
        });

        return $this->defResponse();
    }

    public function stopRecurring(Invoice $invoice)
    {
        $invoice->r = '0';
        $invoice->save();
        return $this->defResponse();
    }

    public function delete(Invoice $invoice)
    {
        return $this->deleteCRUD($invoice);
    }

    public function publicToken($type, $token)
    {

        $type = Arr::get(self::PUBLIC_TOKEN, $type);
        if(!$type) {
            abort(404);
        }

        $class = $type['model'];

        $model = $class::where('vtoken', $token)
            ->with(['items', 'items.service', 'items.document'])
            ->orderBy('id', 'desc')
            ->first();

        if(!$model) {
            abort(404);
        }

        $model->getPublicToken = true;

        return new $type['resource']($model);

//        return new InvoiceItemResource($invoice/*->load(['items', 'items.service'])*/);

    }


}
