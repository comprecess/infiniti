<?php

namespace App\Http\Resources\Client\Order;


use App\Models\Catalog\CartOrder;
use App\Models\Config;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemsResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        return [
            'name' => $this->item_name,
            'amount' => $this->quantity,
            'price' => $this->unit_price,
            'total' => $this->total,
        ];
    }
}
