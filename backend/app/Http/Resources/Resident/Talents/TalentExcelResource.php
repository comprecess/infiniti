<?php

namespace App\Http\Resources\Resident\Talents;

use App\Http\Resources\Traits\NestedParametersTrait;
use App\Http\Resources\Traits\PropValuesTrait;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TalentExcelResource extends JsonResource
{
    use NestedParametersTrait, PropValuesTrait;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $hour = (float) $this->getPropValues('priceHour');
        $day = (float) $this->getPropValues('priceDay');

        return [
            'img' => '',
            'account' => $this->name,
            'specialization' => $this->getPropValues('specialization'),
            'lvl' => $this->getPropValues('lvl'),
            'priceHour' => $this->user?->printPrice($hour) ?? $hour,
            'priceDay' => $this->user?->printPrice($day) ?? $day,
        ];
    }


}
