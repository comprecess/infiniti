<?php

namespace App\Http\Resources\Resident\Invoices;

use App\Http\Requests\Resident\Invoices\InvoiceRequest;
use App\Http\Resources\Contracts\ListInterface;
use App\Http\Resources\Resident\Client\ClientView\SummaryResource;
use App\Http\Resources\Resident\DocumentResource;
use App\Http\Resources\Resident\Settings\CurrencyResource;
use App\Http\Resources\Resident\Settings\PaymentGatewayListResource;
use App\Http\Resources\Traits\ListTrait;
use App\Http\Resources\Resident\Client\ClientResource;
use App\Models\Config;
use App\Models\Resident\Invoices\Invoice;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceItemResource extends JsonResource implements ListInterface
{
    use ListTrait;

    public static $isCollection = false;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $resource = [

        ];
        $this->setList($resource);

        $items = $this->items;
        $currency = $this->getCurrencyIso;

        $resource = array_merge($resource, [
            'id' => $this->id,
            'code' => $this->getCode(),
            'token' => $this->vtoken,
            'client' => new ClientResource($this->user),
            'currency' => new CurrencyResource($this->getCurrencyIso),
            'repeat' => $this->getKeyRepeat(),
            'date' => $this->date?->format('Y-m-d'),
            'dueDate' => $this->getDueDate(),
            'notes' => $this->notes,
            'blank' => InvoiceBlankResource::collection($items),
            'status' => $this->status,
            'blockEdit' => $this->blockEdit(),
            'checkPublic' => $this->check_public,
            'transactions' => TransactionResource::collection($this->transaction),
            'pdf' => route('pdf', ['name' => 'invoice', 'token' => $this->vtoken]),
            'blankCalc' => [
                'price' => $items->summPrice($currency),
                'discount' => $items->summDiscount($currency),
                'tax' => $items->summTax($currency),
                'total' => $items->summTotal($currency),
                'credit' => $this->credit,
                'dueAmount' => $this->getDueAmount(),
            ]
        ]);

        if(!self::$isCollection) {
            $resource['documents'] = DocumentResource::collection($this->documents()->wherePivot('rtype', 'invoice')->get());
        }


        foreach($resource['blankCalc'] as &$value) {
            $value = $this->printPrice($value);
        }
        $resource['blankCalc']['isCredit'] = $this->credit ? true : false;

        $this->typeContent($resource, $request);

        if($this->getPublicToken && $this->checkPublic) {
            $resource['client'] = null;
        }

        if($this->payList) {
            $resource['payList'] = PaymentGatewayListResource::collection($this->payList);
        }

        return $resource;
    }


    public function getList(): array
    {
        $resource = ['id', 'title', 'email', 'phone', 'notes', 'invoicenum' => 'invoiceNum', 'cn'=>'num', 'receipt_number' => 'receiptNumber', 'show_quantity_as' => 'showQuantity'];

        return $resource;
    }

    public static function collection($resource)
    {
        self::$isCollection = true;
        return parent::collection($resource);
    }

    public function typeContent(&$resource, $request)
    {
        if($request->type == 'view') {
            $resource['date'] = $this->date?->format('d/m/Y');
            $resource['dueDate'] = $this->duedate?->format('d/m/Y');
            $resource['client'] = new SummaryResource($this->user->load(['group', 'companyClient', 'transactionPayer', 'transactionPayee']));
            $resource['company'] = ['companyName' => Config::get('CompanyName'), 'companyAddress' => Config::get('caddress')];
            $resource['listStatus'] = Invoice::STATUS;
            $resource['offer'] = new OfferItemResource($this->offer);
        }
    }
}
