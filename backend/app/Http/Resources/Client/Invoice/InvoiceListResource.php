<?php

namespace App\Http\Resources\Client\Invoice;


use App\Http\Resources\Resident\Client\ClientResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceListResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        return [
            'code' => $this->getCode(),
            'amount' => $this->printPrice('total', $this->getCurrencyIso),
            'invoiceDate' => $this->date?->format('d/m/Y'),
            'dueDate' => $this->duedate?->format('d/m/Y'),
            'status' => $this->status,
            'blockEdit' => $this->blockEdit(),
            'type' => $this->r ? 1 : 0,
            'public' => $this->vtoken
        ];
    }

}
