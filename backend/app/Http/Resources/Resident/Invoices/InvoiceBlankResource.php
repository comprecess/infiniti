<?php

namespace App\Http\Resources\Resident\Invoices;

use App\Http\Resources\Resident\Settings\TaxResorce;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceBlankResource extends JsonResource
{

    public function toArray(Request $request): array
    {

        return [
            'id' => $this->id,
            'service' => $this->getNameService(),
            'serviceId' => $this->getNameService(null) ? $this->service_id : null,
            'price' => $this->amount,
            'amount' => $this->qty,
            'discount' => $this->discount_amount,
            'discountType' => $this->getDiscountType(),
            'tax' => new TaxResorce($this->getTax()->first()),
            'description' => $this->description,
            'total' => $this->total
        ];

    }

}
