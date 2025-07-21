<?php

namespace App\Http\Resources\Resident\Invoices;

use App\Http\Resources\Resident\Settings\TaxResource;
use App\Models\Resident\Invoices\Offer;
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
//            'price' => $this->amount,
//            'price' => $this->transformPrice('amount', $this->getCurrencyIso, true),
            'amount' => $this->qty,
            'discount' => $this->printDiscount(),
            'discountType' => $this->getDiscountType(),
            'tax' => new TaxResource($this->getTax()->first()),
            'description' => $this->description ? $this->description : $service?->getDescription(),
//            'total' => $this->total,
//            'total' => $this->transformPrice('total', $this->getCurrencyIso, true),
            'serviceObject' => $service ? new $serviceObject($service) : null
        ];

        if($request->type == 'view') {
            $resorce['price'] = $this->transformPrice('amount', $this->getCurrencyIso, true);
            $resorce['total'] = $this->transformPrice('total', $this->getCurrencyIso, true);
        }else {
            $resorce['price'] = $this->amount;
            $resorce['total'] = $this->total;
        }

        return $resorce;

    }

    public function typeContent(&$resorce, $request)
    {
        $document = $this->document;
        if($request->type == 'view') {
            if($document instanceof Offer) {
                $resorce['price'] = (float) $resorce['price'];
                $resorce['total'] = (float) $resorce['total'];
            } else {
                $resorce['price'] = $document->printPrice((float) $resorce['price']);
                $resorce['total'] = $document->printPrice((float) $resorce['total']);
            }
        }

    }

}
