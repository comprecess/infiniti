<?php

namespace App\Http\Resources\Client\Order;


use App\Models\Catalog\CartOrder;
use App\Models\Config;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderCatalogCartResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        return [
            'total' => $this->printPrice('total', $this->getCurrencyIso),
            'items' => OrderCatalogCartItemResource::collection($this->items)
        ];
    }
}
