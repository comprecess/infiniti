<?php

namespace App\Http\Resources\Resident\Invoices;


use App\Http\Resources\Resident\Client\ClientResource;
use App\Models\Config;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OfferPdfResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        $format = Config::get('df');
        return [
            'code' => $this->getCode(),
            'account' => $this->user->account . "<br>" . $this->user?->companyClient?->company_name,
            'subject' => $this->subject,
            'total' => $this->total,
            'validUntil' => $this->validuntil?->format($format),
            'dateСreated' => $this->datecreated?->format($format),
            'stage' => $this->stage,
        ];
    }

}
