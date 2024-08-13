<?php

namespace App\Http\Resources\Resident\Client\ClientView;

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
            'subject' => $this->subject,
            'code' => $this->getCode(),
            'account' => $this->account,
            'total' => $this->printPrice('total'),
            'dateCreated' => $this->datecreated->format('d/m/Y'),
            'validUntil' => $this->validuntil->format('d/m/Y'),
            'stage' => $this->stage,
        ];
    }


}
