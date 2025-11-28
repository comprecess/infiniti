<?php

namespace App\Http\Resources\Resident\Talents;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        $currency = $this->getCurrencyIso;
        return [
            'id' => $this->id,
            'talent' => new TalentResource($this->userCatalog),
            'amount' => $this->amount,
            'total' => $this->printPrice('total', $currency),
            'nameType' => $this->name_id_type,
            'price' => $this->printPrice('price', $currency),
            'taxesInclude' => $this->taxes_include,
            'tax' => $this->printPrice(round($this->getTaxesTotalPrice(), 2), $currency)
        ];
    }

}
