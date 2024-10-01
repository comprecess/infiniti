<?php

namespace App\Http\Resources\Resident\Invoices;

use App\Http\Resources\Resident\Settings\TaxResorce;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceBlankResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        $service = $this->service;
        $serviceObject = $service?->getServiceResources();
        $resorce = [
            'id' => $this->id,
            'service' => $this->getNameService(),
            'serviceId' => $this->getNameService(null) ? $this->service_id : null,
            'price' => $this->amount,
            'amount' => $this->qty,
            'discount' => $this->discount_amount,
            'discountType' => $this->getDiscountType(),
            'tax' => new TaxResorce($this->getTax()->first()),
            'description' => $this->description ? $this->description : $service?->getDescription(),
            'total' => $this->total,
            'serviceObject' => $service ? new $serviceObject($service) : null
        ];

        $this->typeContent($resorce, $request);

        return $resorce;

    }

    public function typeContent(&$resorce, $request)
    {
        $invoice = $this->document;
        if($request->type == 'view') {
            $resorce['price'] = $invoice->printPrice((float) $resorce['price']);
            $resorce['total'] = $invoice->printPrice((float) $resorce['total']);
        }
    }

}
