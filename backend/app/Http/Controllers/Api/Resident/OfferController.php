<?php


namespace App\Http\Controllers\Api\Resident;


use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Requests\Resident\Invoices\InvoiceBlankRequest;
use App\Http\Requests\Resident\Invoices\InvoicePriceCalcRequest;
use App\Http\Requests\Resident\Invoices\InvoiceRequest;
use App\Http\Requests\Resident\Invoices\OfferListRequest;
use App\Http\Requests\Resident\Invoices\OfferRequest;
use App\Http\Resources\Resident\Client\ClientResource;
use App\Http\Resources\Resident\Invoices\InvoiceBlankResource;
use App\Http\Resources\Resident\Invoices\InvoiceItemResource;
use App\Http\Resources\Resident\Invoices\OfferExcelResource;
use App\Http\Resources\Resident\Invoices\OfferListResource;
use App\Http\Resources\Resident\Invoices\OfferPdfResource;
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

class OfferController extends ResidentController
{
    use CRUD{
        createOrUpdate as createOrUpdateCRUD;
        delete as deleteCRUD;
    }

    public function getDocumentVariables(): DocumentVariables
    {
        $columns = [
            'code' => 'Code',
            'account' => 'Name and Company name',
            'subject' => 'Subject',
            'total' => 'Amount',
            'validUntil' => 'Best before date',
            'dateСreated' => 'Date create',
            'stage' => 'Stage',
        ];

        $varibles = new DocumentVariables();

        $varibles->nameDocument = "Offer";
        $varibles->header = "Offer - Infiniti";
        $varibles->columns = $columns;
        $varibles->excelView = 'document.excel.resident-invoice';
        $varibles->resource = request()->input('document') == 'pdf' ? OfferPdfResource::class : OfferExcelResource::class;


        return $varibles;
    }

    public function list(OfferListRequest $request)
    {

        #ДОСТУП

        $invoice = Offer::query()
            ->select('sys_quotes.*')
            ->leftJoin('crm_accounts', 'crm_accounts.id', '=', 'sys_quotes.userid')
            ->leftJoin('sys_companies', 'sys_companies.id', '=', 'crm_accounts.cid')
            ->with(['user', 'user.companyClient', 'user.group']);

        $requestAll = $request->all();

        if(($search = Arr::get($requestAll, 'filter.search')) !== null) {
            $invoice->where(function($q) use ($search){
                $search = "%" . $search . "%";
                $q->where('sys_quotes.id', 'like', $search)
                    ->orWhere(DB::raw("CONCAT(`sys_quotes`.`invoicenum`, '', IF(`sys_quotes`.`cn` != '', `sys_quotes`.`cn`, `sys_quotes`.`id`))"), 'like', $search)
                    ->orWhere('crm_accounts.account', 'like', $search)
                    ->orWhere('sys_companies.company_name', 'like', $search)
                    ->orWhere('sys_quotes.total', 'like', $search)
                    ->orWhere(DB::raw("DATE_FORMAT(`sys_quotes`.`datecreated`, '%d/%m/%Y')"), 'like', $search)
                    ->orWhere(DB::raw("DATE_FORMAT(`sys_quotes`.`validuntil`, '%d/%m/%Y')"), 'like', $search);
            });
        }


        $request->sortModel($invoice);

        return $this->index($invoice, OfferListResource::class, true);
    }

    public function inputData()
    {

        return response()->json([
            'client' => ClientResource::collection(Client::getForSelect()),
            'stage' => Offer::STAGE,
            'num' => Offer::getNextNum(),
            'offerNum' => Config::get('quotation_code_prefix', 'OFFER-'),
            'tax' => TaxResorce::collection(Tax::getForSelect()),
        ]);
    }


    public function createOrUpdate(OfferRequest $request, Offer $offer)
    {

        $requestCalc = app(InvoicePriceCalcRequest::class);
        list($sum, $result) = InvoiceController::blankCalc($requestCalc);

        return $this->createOrUpdateCRUD(
            $request,
            $offer,
            function($model, $request, $isNew) use($sum){

                $model->invoicenum = $request->offerNum ? $request->offerNum : Config::get('quotation_code_prefix', 'OFFER-');
                $model->subtotal = $sum[0];
                $model->discount = $sum[1];
                $model->total = $sum[3];

                $model->lastmodified = now();


                if($isNew) {
                    $model->is_same_state = 1;
                    foreach(['vtoken'] as $name) {
                        $model->setRandomNum($name, 10, true);
                    }
                }
            },
            function($model) use ($requestCalc){
                InvoiceItem::createOrUpdate($requestCalc, $model);
            }
        );
    }

    public function item(Invoice $invoice)
    {
        return new InvoiceItemResource($invoice->load(['items', 'items.service', 'items.invoice']));
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

        $invoice->getPublicToken = true;

        return new InvoiceItemResource($invoice/*->load(['items', 'items.service'])*/);

    }


}
