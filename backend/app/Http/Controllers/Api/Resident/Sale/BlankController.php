<?php


namespace App\Http\Controllers\Api\Resident\Sale;


use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Requests\Resident\Invoices\InvoiceBlankRequest;
use App\Http\Requests\Resident\Invoices\InvoicePriceCalcRequest;
use App\Http\Resources\Resident\Invoices\InvoiceBlankResource;
use App\Models\Contracts\ModelServiceInterface;
use App\Models\Resident\Invoices\Invoice;
use App\Models\Resident\Invoices\InvoiceItem;
use App\Models\Resident\Invoices\Offer;
use App\Models\Resident\Settings\Tax;
use Illuminate\Support\Arr;
use Illuminate\Http\Request;

class BlankController extends SaleController
{

    const TYPE_BLANK = ['invoice' => Invoice::class, 'offer' => Offer::class];

    use CRUD{
        createOrUpdate as createOrUpdateCRUD;
        delete as deleteCRUD;
    }

    protected function getModel()
    {
        $class = Arr::get(self::TYPE_BLANK, request()->route('typeBlank'));
        return $class::findOrFail(request()->route('idType'));
    }

    public function blankList()
    {
        $model = $this->getModel();
        $items = $model->items;
        if($model instanceof Invoice) {
            $calc = [
                'price' => $model->printPrice($items->summPrice()),
                'discount' => $model->printPrice($items->summDiscount()),
                'tax' => $model->printPrice($items->summTax()),
                'total' => $model->printPrice($items->summTotal())
            ];
        } else {
            $calc = [
                'price' => $items->summPrice(),
                'discount' => $items->summDiscount(),
                'tax' => $items->summTax(),
                'total' => $items->summTotal()
            ];
        }

        return response()->json([
            'blank' => InvoiceBlankResource::collection($items),
            'blankCalc' => $calc
        ]);
    }

    public function blankCreateOrUpdate(InvoiceBlankRequest $request)
    {

        $item = InvoiceItem::find($request->route('item')) ?? new InvoiceItem();
        $document = $this->getModel();
        if($item->id) {
            if(!$document->items()->where('id', $item->id)->count()) {
                abort(404);
            }
        }

        return $this->createOrUpdateCRUD(
            $request,
            $item,
            function ($model, $request, $isNew) use($document){
                if($isNew) {
                    $model->insertDefaultValue();
                }
                $model->document_type = $document::class;
                $model->document_id = $document->id;
                $model->invoiceid = $document->id;
                $model->userid = $document->userid;
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

    public function blankDelete(Request $request)
    {
        $item = InvoiceItem::findOrFail($request->route('item'));
        $model = $this->getModel();
        $document = $item->document;
        if($document::class == $model::class && $model->id == $document->id) {
            $item->delete();
            return response()->json(['success' => true]);
        }
        return response()->json(['success' => false, 'message' => 'Form not found in invoice']);
    }

    public function listService(Request $request)
    {
        $service = $request->route('service');
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


}
