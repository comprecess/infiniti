<?php

namespace App\Http\Resources\Catalog;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Number;

class CartItemResorce extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $taxesPrice = $this->getTaxesTotalPrice();
        return [
            'id' => $this->id,
            'userCatalog' => new UsersResorce($this->userCatalog),
            'nameIdType' => $this->name_id_type,
            'amount' => $this->amount,
            'taxesInclude' => $this->taxes_include,
            'price' => $this->printPrice('price'),
            'taxes' => $taxesPrice ? $this->printPrice($taxesPrice) : $taxesPrice,
            'total' => $this->printPrice('total'),
            'idBusinessPlan' => $this?->business_plan_id,
        ];
    }
}
