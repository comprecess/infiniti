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
        return [
            'id' => $this->id,
            'client' => new ClientResource($this->user),
            'lvl' => $this->getPropValues('lvl'),
            'priceHour' => $this->user->printPrice((float) $this->getPropValues('priceHour')),
            'priceDay' => $this->user->printPrice((float) $this->getPropValues('priceDay')),
        ];
    }

}
