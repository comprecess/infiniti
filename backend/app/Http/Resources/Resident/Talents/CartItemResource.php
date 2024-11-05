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
            'total' => number_format($this->total, 2, '.', ''),
            'nameType' => $this->name_id_type,
            'price' => number_format($this->price, 2, '.', ''),
            'taxesInclude' => $this->taxes_include,
            'tax' =>number_format(round($this->getTaxesTotalPrice(), 2), 2, '.', '')
        ];
    }

}
