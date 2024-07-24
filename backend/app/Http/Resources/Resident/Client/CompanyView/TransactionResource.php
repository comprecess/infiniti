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
            'date' => $this->date->format('Y-m-d'),
            'account' => $this->account,
            'type' => $this->type,
            'status' => $this->status,
            'amount' => $this->printPrice('amount'),
            'description' => $this->description,
            'dr' => $this->dr,
            'cr' => $this->cr,
            'bal' => $this->bal,
        ];
    }


}
