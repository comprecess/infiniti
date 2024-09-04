<?php

namespace App\Http\Resources\Resident\Settings;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Number;

class CurrencyResorce extends JsonResource
{
    private $currencyInfo = null;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        return [
            'id' => $this->id,
            'code' => $this->iso_code,
            'rate' => $this->rate,
            'isdefault' => $this->isdefault,
            'info' => $this->getInfo()
        ];
    }
}
