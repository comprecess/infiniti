<?php

namespace App\Http\Resources\Resident\Talents;


use App\Http\Resources\Resident\Client\ClientResource;
use App\Http\Resources\Traits\NestedParametersTrait;
use App\Http\Resources\Traits\PropValuesTrait;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TalentListResource extends JsonResource
{
    use NestedParametersTrait, PropValuesTrait;

    public function toArray(Request $request): array
    {
        $hour = (float) $this->getPropValues('priceHour');
        $day = (float) $this->getPropValues('priceDay');
        return [
            'id' => $this->id,
            'name' => $this->name,
            'img' => $this->getLastFile(true) ?? "",
//            'client' => new ClientResource($this->user),
            'specialization' => $this->getPropValues('specialization'),
            'lvl' => $this->getPropValues('lvl'),
            'priceHour' => $this->printPrice($hour) ?? $hour,
            'priceDay' => $this->printPrice($day) ?? $day,
        ];
    }

}
