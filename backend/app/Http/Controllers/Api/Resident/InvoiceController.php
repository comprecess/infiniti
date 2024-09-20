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
use App\Http\Resources\Resident\Settings\CurrencyResorce;
use App\Http\Resources\Resident\Settings\TaxResorce;
use App\Models\Config;
use App\Models\Contracts\ModelServiceInterface;
use App\Models\Resident\Invoices\Invoice;
use App\Models\Resident\Invoices\InvoiceItem;
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

    public static function blankCalc(InvoicePriceCalcRequest $request)
    {
        $result = [];
        $sum = [0,0,0,0];
        foreach($request->getPriceList() as $key => $value) {
            $class = InvoiceItem::SERVICE[$value['service']];
            $a = intval($value['amount'] ?? 0);
            $p = (float) ($value['price'] ?? 0);
            if(class_exists($class) && $p == 0) {
                $priceModel = $class::findOrFail($value['serviceId']);
                $p = $priceModel->getPrice();
            }

            $price = round($a * $p, 2);
            $discount =  round($request->discount($price, $value['discountType'] ?? null, $value['discount'] ?? null), 2);

            $total = round($price - $discount, 2);

            if(isset($value['tax'])) {
                $taxModel = Tax::findOrFail($value['tax']);
                $tax = $taxModel->getTaxPrice($total);
                $taxRate = $taxModel->rate;
            } else {
                $tax = 0;
                $taxRate = 0;
            }

            $total += $tax;
            $result[$key]['service'] = $value['service'];
            $result[$key]['serviceId'] = $value['serviceId'] ?? null;
            $result[$key]['id'] = $value['id'] ?? null;
            $result[$key]['total'] = $total;
            $result[$key]['price'] = $p;
            $result[$key]['amount'] = $a;
            $result[$key]['tax'] = $tax;
            $result[$key]['taxRate'] = $taxRate;
            $result[$key]['discountType'] = $value['discountType'] ?? null;
            $result[$key]['discountValue'] = $value['discount'] ?? null;
            $result[$key]['discountTotal'] = $discount;
            $result[$key]['description'] = $value['description'] ?? $description ?? null;

            $sum[0] += $price;
            $sum[1] += $discount;
            $sum[2] += $tax;
            $sum[3] += $total;

        }

        return [$sum, $result];
    }

    public function priceCalc(InvoicePriceCalcRequest $request)
    {
        list($sum, $result) = self::blankCalc($request);

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
        list($sum, $result) = self::blankCalc($requestCalc);

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
                        do{
                            $model->setRandomNum($name, 10);
                            $count = Invoice::where($name, $model->{$name})->count();
                        } while($count != 0);
                    }
                    $model->datepaid = now();
                }
            },
            function($model, $request, $isNew) use ($result, $requestCalc){
                foreach($result as $value) {
                    if($value['id']) {
                        $invoiceItem = $model->items()->where('id', $value['id'])->first();
                        if(!$invoiceItem) {
                            throw ValidationException::withMessages([$requestCalc->getPriceList(false) . ".id" => __('validation.regex', ['attribute' => $value['id']])]);
                        }
                    } else {
                        $invoiceItem = new InvoiceItem();
                    }
                    $invoiceItem->insertDefaultValue();
                    $invoiceItem->invoiceid = $model->id;
                    $invoiceItem->userid = $request->clientId;
                    $invoiceItem->description = $value['description'] ?? '';
                    $invoiceItem->qty = $value['amount'];
                    $invoiceItem->amount = $value['price'];
                    $invoiceItem->total = $value['total'];
                    $invoiceItem->tax_rate = $value['taxRate'];
                    $invoiceItem->taxamount = $value['tax'];
                    if($value['tax']) {
                        $invoiceItem->taxed = 1;
                    }else{
                        $invoiceItem->taxed = 0;
                    }
                    $invoiceItem->discount_type = $value['discountType'] == 'percent' ? 'p' : 'f';
                    $invoiceItem->discount_amount = $value['discountValue'] ?? 0;
                    $invoiceItem->itemcode = $value['serviceId'] ?? '';

                    if(isset($value['serviceId']) && isset($value['service'])) {
                        $invoiceItem->service_type = InvoiceItem::SERVICE[$value['service']];
                        $priceModel = $invoiceItem->service_type::findOrFail($value['serviceId']);
                        $invoiceItem->service_id = $value['serviceId'];
                        $invoiceItem->amount = $priceModel->getPrice();
                    }
                    $invoiceItem->save();
                }

            }
        );
    }

    public function blankDelete(Invoice $invoice, InvoiceItem $item)
    {
        if($invoice->id == $item->invoiceid) {
            $item->delete();
            return response()->json(['success' => true]);
        }
        return response()->json(['success' => false, 'message' => 'Form not found in invoice']);
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
        return new InvoiceItemResource($invoice->load(['items', 'items.service', 'items.invoice']));
    }

    public function invoiceClone(Invoice $invoice)
    {
        $new = $invoice->replicate(['status' => Invoice::STATUS[0], 'cn' => Invoice::getNextNum()]);
        $new->status = Invoice::STATUS[0];
        $new->cn = Invoice::getNextNum();
        $new->save();

        $invoice->items->each(function($item) use($new){
            $newItem = $item->replicate(['invoiceid' => $new->id]);
            $newItem->invoiceid = $new->id;
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

    public function blankList(Invoice $invoice)
    {
        $items = $invoice->items;
        return response()->json([
            'blank' => InvoiceBlankResource::collection($items),
            'blankCalc' => [
                'price' => $invoice->printPrice($items->summPrice()),
                'discount' => $invoice->printPrice($items->summDiscount()),
                'tax' => $invoice->printPrice($items->summTax()),
                'total' => $invoice->printPrice($items->summTotal())
            ]
        ]);
    }

    public function blankCreateOrUpdate(InvoiceBlankRequest $request,Invoice $invoice, InvoiceItem $item)
    {
        if($item->id) {
            if(!$invoice->items()->where('id', $item->id)->count()) {
                abort(404);
            }
        }

        return $this->createOrUpdateCRUD(
            $request,
            $item,
            function ($model, $request, $isNew) use($invoice){
                if($isNew) {
                    $model->insertDefaultValue();
                }
                $model->invoiceid = $invoice->id;
                $model->userid = $invoice->userid;
                $model->description = $request->description ?? '';
                $model->qty = (int) $request->amount ?? 0;
                $model->amount =(float) $request->price;

                if($request->tax) {
                    $taxModel = Tax::findOrFail($request->tax);
                    $model->tax_rate = $taxModel->rate;
                    $model->taxed = 1;
                } else {
                    $model->tax_rate = 0;
                    $model->taxed = 0;
                }

                $model->discount_type = InvoiceItem::DISCOUNT_TYPE[$request->discountType ?? 'fixed'];
                $model->discount_amount =(float) $request->discount ?? 0;
                $model->itemcode = $request->serviceId ?? '';

                if($request->serviceId && $request->service) {
                    $model->service_type = InvoiceItem::SERVICE[$request->service];
                    $priceModel = $model->service_type::findOrFail($request->serviceId);
                    $model->service_id = $priceModel->id;
                    if($model->amount == 0) {
                        $model->amount = $priceModel->getPrice();
                    }

                    if(!$model->description) {
                        $model->description = $priceModel->getDescription();
                    }
                }else{
                    $model->service_type = null;
                    $model->service_id = null;
                }
                $model->calc();
            }
        );
    }

    public function publicToken($token)
    {
        $invoice = Invoice::where('vtoken', $token)
            ->with(['items', 'items.service', 'items.invoice'])
            ->orderBy('id', 'desc')
            ->first();

        if(!$invoice) {
            abort(404);
        }

        return new InvoiceItemResource($invoice/*->load(['items', 'items.service'])*/);

    }


}
