<?php

namespace App\Http\Resources\Resident\Invoices;

use App\Http\Requests\Resident\Invoices\InvoiceRequest;
use App\Http\Resources\Contracts\ListInterface;
use App\Http\Resources\Resident\Settings\CurrencyResorce;
use App\Http\Resources\Traits\ListTrait;
use App\Http\Resources\Resident\Client\ClientResource;
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
        $listStatus = array_flip(InvoiceRequest::STATUS);

        $resorce = array_merge($resorce, [
            'id' => $this->id,
            'code' => $this->getCode(),
            'client' => new ClientResource($this->user),
            'currency' => new CurrencyResorce($this->getCurrencyIso),
            'repeat' => $this->getKeyRepeat(),
            'date' => $this->date->format('Y-m-d'),
            'dueDate' => $this->getDueDate(),
            'notes' => $this->notes,
            'blank' => InvoiceBlankResource::collection($items),
            'status' => isset($listStatus[$this->status]) ? $listStatus[$this->status] : null,
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
}
