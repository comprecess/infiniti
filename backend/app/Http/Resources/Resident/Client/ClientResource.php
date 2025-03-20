<?php

namespace App\Http\Resources\Resident\Client;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientResource extends JsonResource
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
            'img' => $this->getAvatar(true),
            'account' => $this->account,
            'code' => $this->code,
            'company' => new CompanyResource($this->companyClient),
            'group' => new GroupResource($this->group),
            'email' => $this->email,
            'phone' => $this->phone,
            'address' => $this->address,
            'city' => $this->city,
            'state' => $this->state,
            'zip' => $this->zip,
            'country' => $this->country,
            'created' => $this->created_at?->format('d/m/Y')
        ];
    }


}
