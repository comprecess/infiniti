<?php

namespace App\Http\Resources\Catalog;

use App\Http\Resources\Contracts\ListInterface;
use App\Http\Resources\Traits\ListTrait;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Number;

class CartResorce extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $items = $this?->items;
        return [
            "secret" => $this->secret,
            "total" => $this->getCurrency('total'),
            "generalTax" => $this->getCurrency('general_tax'),
            "count" => $items->count(),
            "items" => CartItemResorce::collection($items),
            "createdAt" => $this->created_at,
        ];
    }

}
