<?php

namespace App\Http\Resources\Resident\Client;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientInfoResource extends JsonResource
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
            'account' => $this->account,
            'code' => $this->code,
            'email' => $this->email,
        ];
    }


}
