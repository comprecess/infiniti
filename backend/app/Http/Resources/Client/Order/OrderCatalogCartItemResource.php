<?php

namespace App\Http\Resources\Client\Order;


use App\Models\Catalog\CartOrder;
use App\Models\Config;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderCatalogCartItemResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        return [
            'name' => $this->userCatalog->name,
            'type' => $this->name_id_type,
            'amount' => $this->amount,
            'price' => $this->printPrice('price', $this->getCurrencyIso),
            'total' => $this->printPrice('total', $this->getCurrencyIso)
        ];
    }
}
