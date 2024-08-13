<?php

namespace App\Http\Resources\Resident\Client\CompanyView;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
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
            'date' => $this->date->format('d/m/Y'),
            'account' => $this->account,
            'client' => $this->payerid ? new ClientResource($this->payerUser) : new ClientResource($this->payeeUser),
            'payerid' => $this->payerid,
            'payeeid' => $this->payeeid,
            'type' => $this->type,
            'status' => $this->status,
            'amount' => $this->printPrice('amount'),
            'description' => $this->description,
            'dr' => $this->printPrice('dr'),
            'cr' => $this->printPrice('cr'),
            'bal' => $this->bal,
        ];
    }


}
