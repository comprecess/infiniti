<?php

namespace App\Http\Resources\Resident\Client;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientExcelResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'img' => '',
            'account' => $this->account . "\r\n" . $this->code,
            'company' => $this->companyClient?->company_name,
            'group' => $this->group?->gname,
            'email' => $this->email,
            'phone' => $this->phone
        ];
    }


}
