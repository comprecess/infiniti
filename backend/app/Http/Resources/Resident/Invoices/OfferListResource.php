<?php

namespace App\Http\Resources\Resident\Invoices;


use App\Http\Resources\Resident\Client\ClientResource;
use App\Models\Config;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OfferListResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        $format = Config::get('df');
        return [
            'id' => $this->id,
            'code' => $this->getCode(),
            'account' => new ClientResource($this->user),
            'subject' => $this->subject,
            'total' => $this->total,
            'validUntil' => $this->validuntil?->format($format),
            'dateCreated' => $this->datecreated?->format($format),
            'stage' => $this->stage,
        ];
    }

}
