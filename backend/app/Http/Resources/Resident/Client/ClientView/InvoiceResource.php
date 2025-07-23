<?php

namespace App\Http\Resources\Resident\Client\ClientView;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceResource extends JsonResource
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
            'account' => $this->user?->account,
            'total' => $this->transformPrice('total', $this->getCurrencyIso, true),
            'date' => $this->date->format('d/m/Y'),
            'dueDate' => $this->duedate->format('d/m/Y'),
            'status' => $this->status,
       ];
    }


}
