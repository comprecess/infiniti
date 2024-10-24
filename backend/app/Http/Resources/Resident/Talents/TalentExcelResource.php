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
        $user = $this->user;
        $hour = (float) $this->getPropValues('priceHour');
        $day = (float) $this->getPropValues('priceDay');

        return [
            'img' => '',
            'account' => $user?->account . "\r\n" . $user?->code,
            'specialization' => $this->getPropValues('specialization'),
            'lvl' => $this->getPropValues('lvl'),
            'priceHour' => $this->user?->printPrice($hour) ?? $hour,
            'priceDay' => $this->user?->printPrice($day) ?? $day,
        ];
    }


}
