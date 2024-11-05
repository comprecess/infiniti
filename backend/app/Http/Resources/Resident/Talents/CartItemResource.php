<?php

namespace App\Http\Resources\Resident\Talents;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
{

    public function toArray(Request $request): array
    {

        return [
            'id' => $this->id,
            'talent' => new TalentResource($this->userCatalog),
            'amount' => $this->amount,
            'total' => $this->total,
            'nameType' => $this->name_id_type,
            'price' => $this->price,
            'taxesInclude' => $this->taxes_include,
            'tax' => $this->getTaxesTotalPrice()
        ];
    }

}
