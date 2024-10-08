<?php

namespace App\Http\Resources\Resident\Invoices;

use App\Http\Requests\Resident\Invoices\InvoiceRequest;
use App\Http\Resources\Contracts\ListInterface;
use App\Http\Resources\Resident\Client\ClientView\SummaryResource;
use App\Http\Resources\Resident\Settings\CurrencyResource;
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
        $resorce = [

        ];
        $this->setList($resorce);

        $items = $this->items;


        $resorce = array_merge($resorce, [
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
            'pdf' => route('pdf', ['name' => 'invoice', 'token' => $this->vtoken]),
            'blankCalc' => [
                'price' => $items->summPrice(),
                'discount' => $items->summDiscount(),
                'tax' => $items->summTax(),
                'total' => $items->summTotal()
            ]
        ]);


        foreach($resorce['blankCalc'] as &$value) {
            $value = $this->printPrice($value);
        }

        $this->typeContent($resorce, $request);

        if($this->getPublicToken && $this->checkPublic) {
            $resorce['client'] = null;
        }

        return $resorce;
    }


    public function getList(): array
    {
        $resorce = ['id', 'title', 'email', 'phone', 'notes', 'invoicenum' => 'invoiceNum', 'cn'=>'num', 'receipt_number' => 'receiptNumber', 'show_quantity_as' => 'showQuantity'];

        return $resorce;
    }

    public static function collection($resource)
    {
        self::$isCollection = true;
        return parent::collection($resource);
    }

    public function typeContent(&$resorce, $request)
    {
        if($request->type == 'view') {
            $resorce['date'] = $this->date?->format('d/m/Y');
            $resorce['dueDate'] = $this->duedate?->format('d/m/Y');
            $resorce['client'] = new SummaryResource($this->user->load(['group', 'companyClient', 'transactionPayer', 'transactionPayee']));
            $resorce['company'] = ['companyName' => Config::get('CompanyName'), 'companyAddress' => Config::get('caddress')];
            $resorce['listStatus'] = Invoice::STATUS;
            $resorce['offer'] = new OfferItemResource($this->offer);
        }
    }
}
