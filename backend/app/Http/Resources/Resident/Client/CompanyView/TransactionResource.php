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
        $curreency = $this->getCurrencyIso;
        return [
            'id' => $this->id,
            'date' => $this->date?->format('d/m/Y'),
            'account' => $this->account,
            'client' => $this->payerid ? new ClientResource($this->payerUser) : new ClientResource($this->payeeUser),
            'payerid' => $this->payerid,
            'payeeid' => $this->payeeid,
            'type' => $this->type,
            'status' => $this->status,
            'amount' => $this->transformPrice('amount', $curreency, true),
            'description' => $this->description,
            'dr' => $this->transformPrice('dr', $curreency, true),
            'cr' => $this->transformPrice('cr', $curreency, true),
            'bal' => $this->bal,
        ];
    }


}
