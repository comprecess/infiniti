<?php

namespace App\Http\Resources\Resident\Settings;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Number;

class CurrencyResorce extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
//            "name" => $this['name'],
//            "code" => $this['code'],
//            "nameCode" => $this['nameCode'],
//            "checked" => $this['checked'],
            'id' => $this->id,
            'code' => $this->iso_code,
            'symbol' => $this->symbol,
            'rate' => $this->rate,
            'isdefault' => $this->isdefault,
        ];
    }
}
