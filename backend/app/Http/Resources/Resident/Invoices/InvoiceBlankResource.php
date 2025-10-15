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
        $currency = $this->getCurrencyIso;
        $resource = [
            'id' => $this->id,
            'service' => $this->getNameService(),
            'serviceId' => $this->getNameService(null) ? $this->service_id : null,
//            'price' => $this->amount,
//            'price' => $this->transformPrice('amount', $this->getCurrencyIso, true),
            'amount' => $this->qty,
            'discountType' => $this->getDiscountType(),
            'tax' => new TaxResource($this->getTax()->first()),
            'description' => $this->description ? $this->description : $service?->getDescription(),
//            'total' => $this->total,
//            'total' => $this->transformPrice('total', $this->getCurrencyIso, true),
            'serviceObject' => $service ? new $serviceObject($service) : null
        ];

        if($request->type == 'view') {
            $resource['price'] = $this->transformPrice('amount', $currency, true);
            $resource['total'] = $this->transformPrice('total', $currency, true);
            $resource['discount'] = $this->printDiscount();
        }else {
            $resource['price'] = $this->amount;
            $resource['total'] = $this->total;
            $resource['discount'] = round($this->discount_amount, 2);
        }

        return $resource;

    }

    public function typeContent(&$resource, $request)
    {
        $document = $this->document;
        if($request->type == 'view') {
            if($document instanceof Offer) {
                $resource['price'] = (float) $resource['price'];
                $resource['total'] = (float) $resource['total'];
            } else {
                $resource['price'] = $document->printPrice((float) $resource['price']);
                $resource['total'] = $document->printPrice((float) $resource['total']);
            }
        }

    }

}
