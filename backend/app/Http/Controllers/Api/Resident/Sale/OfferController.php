<?php


namespace App\Http\Controllers\Api\Resident\Sale;

use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Requests\Resident\Invoices\InvoicePriceCalcRequest;
use App\Http\Requests\Resident\Invoices\OfferListRequest;
use App\Http\Requests\Resident\Invoices\OfferRequest;
use App\Http\Requests\Resident\Invoices\OfferUpdateRequest;
use App\Http\Resources\Resident\Client\ClientResource;
use App\Http\Resources\Resident\Invoices\OfferExcelResource;
use App\Http\Resources\Resident\Invoices\OfferItemResource;
use App\Http\Resources\Resident\Invoices\OfferListResource;
use App\Http\Resources\Resident\Invoices\OfferPdfResource;
use App\Http\Resources\Resident\Settings\TaxResource;
use App\Models\Catalog\Cart;
use App\Models\Config;
use App\Models\Resident\Invoices\Invoice;
use App\Models\Resident\Invoices\InvoiceItem;
use App\Models\Resident\Invoices\Offer;
use App\Models\Resident\Settings\Currency;
use App\Models\Resident\Settings\Tax;
use App\Models\Users\Client;
use App\Services\Document\DocumentVariables;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class OfferController extends SaleController
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
        $varibles->excelView = 'document.excel.resident-offer';
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
            ->with(['user', 'user.companyClient', 'user.group', 'getCurrencyIso']);

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
            'tax' => TaxResource::collection(Tax::getForSelect()),
            'service' => InvoicePriceCalcRequest::getService()->keys()
        ]);
    }


    public function createOrUpdate(OfferRequest $request, Offer $offer)
    {

        $requestCalc = app(InvoicePriceCalcRequest::class);
        list($sum, $result) = InvoiceItem::blankCalc($requestCalc);

        return $this->createOrUpdateCRUD(
            $request,
            $offer,
            function($model, $request, $isNew) use($sum){

                $model->invoicenum = $request->offerNum ? $request->offerNum : Config::get('quotation_code_prefix', 'OFFER-');
                $model->subtotal = $sum[0];
                $model->discount = $sum[1];
                $model->total = $sum[3];

                $model->lastmodified = now();

                $client = Client::findOrFail($request->clientId);
                $model->account = $client->account;
                $model->cn = $request->num ? $request->num : '';
                $model->customernotes = $request->notes ? $request->notes : '';
                $model->proposal = $request->proposal ?? '';
                $model->lastmodified = now();
                $model->datesent = now();

                #currency
                $currency = Currency::getDefault();
                $model->currency = $currency->id;
                $model->currency_iso_code = $currency->iso_code;


                if($isNew) {
                    foreach(['vtoken'] as $name) {
                        $model->setRandomNum($name, 10, true);
                    }
                }
            },
            function($model, $request) use ($requestCalc){
                InvoiceItem::createOrUpdate($requestCalc, $model);

                if($request->token) {
                    $cart = Cart::where('secret', $request->token)->first();
                    $cart->createOrder($model);
                }
            }
        );
    }

    public function update(OfferUpdateRequest $request, Offer $offer)
    {
        $request->setModel($offer, true);
        $offer->save();
        return response()->json(['success' => true]);
    }

    public function item(Offer $offer)
    {
        return new OfferItemResource($offer->load(['items', 'items.invoice', 'items.getCurrencyIso', 'getCurrencyIso']));
    }

    public function delete(Offer $offer)
    {
        return $this->deleteCRUD($offer);
    }

    public function convert(Offer $offer)
    {
        $converColumn = [
            'userid', 'account', 'subtotal', 'discount_type', 'discount_value', 'discount', 'total', 'tax1' => 'tax', 'taxname', 'taxrate', 'currency_iso_code'
        ];

        $date = now();

        $invoice = Invoice::newDefault();
        foreach ($converColumn as $key => $val) {
            $value = is_int($key) ? $offer->{$val} : $offer->{$key};
            $invoice->{$val} = $value;
        }

        $invoice->getCurrencyIso()->associate($offer->getCurrencyIso ?? Currency::getDefault());
        $invoice->date = $date;
        $invoice->duedate = $date;
        $invoice->nd = $date;
        $invoice->quote_id = intval($offer->id);
        if($offer->status()->checkCart()) {
            $invoice->notes = Config::get('invoice_terms');
        }
        $invoice->invoicenum = Config::get('invoice_code_prefix', 'INV-');
        $invoice->save();

        $offer->items->each(function ($item) use($invoice){
            $newItem = $item->replicate();
            $newItem->document()->associate($invoice);
            $newItem->invoiceid = $invoice->id;
            $newItem->save();
        });
        return response()->json(['success' => true, 'invoiceId' => $invoice->id]);
    }

    public function fromCart(Request $request)
    {
        $token = $request->route('token');

        $cart = Cart::where('secret', $token)->orderByDesc('id')->first();
        if(!$cart) {
            abort(404);
        }
        $model = Offer::createCart($cart);

        return new OfferItemResource($model);
    }

}
