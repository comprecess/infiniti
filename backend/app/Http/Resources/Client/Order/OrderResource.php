<?php

namespace App\Http\Resources\Client\Order;


use App\Models\Catalog\CartOrder;
use App\Models\Config;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        $resource = [
            'cName' => $this->cname,
            'date' => $this->date_added?->format(Config::get('df')),
            'orderNum' => $this->ordernum,
            'amount' => $this->printPrice('amount', $this->getCurrencyIso),
            'status' => $this->status,
            'items' => OrderItemsResource::collection($this->items)
        ];

        $model = $this->model;
        $resource['catalog'] = $model instanceof CartOrder ? new OrderCatalogCartResource($model->cartOrder) : null;

        return $resource;
    }
}
