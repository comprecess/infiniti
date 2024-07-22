<?php

namespace App\Http\Resources\Resident\Client\CompanyView;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OffercResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->getCode(),
            'account' => $this->account,
            'total' => $this->printPrice('total'),
            'dateCreated' => $this->datecreated->format('Y-m-d'),
            'validUntil' => $this->validuntil->format('Y-m-d'),
            'stage' => $this->stage,
        ];
    }


}
