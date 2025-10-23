<?php

namespace App\Http\Resources\Client\Order;


use App\Http\Resources\Catalog\CartItemResorce;
use App\Http\Resources\Client\BusinessPlan\BusinessPlanResource;
use App\Models\Config;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderCatalogListResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        $order = $this->order;

        return [
            'id' => $order->id,
            'date' => $this->deleted_at?->format(Config::get('df')),
            'orderNum' => $this->ordernum,
            'amount' => $this->printPrice('total', $this->getCurrencyIso),
//            'status' => $this->status,
//            'itemCount' => $this->items->count(),
            'items' => CartItemResorce::collection($this->items),
            'businessPlan' => new BusinessPlanResource($this->businessPlan)
        ];
    }
}
