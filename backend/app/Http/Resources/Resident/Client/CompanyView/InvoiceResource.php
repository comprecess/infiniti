<?php

namespace App\Http\Resources\Resident\Client\CompanyView;

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
            'client' => new ClientResource($this->user),
            'account' => $this->account,
            'total' => $this->printPrice('total'),
            'date' => $this->date->format('Y-m-d'),
            'dueDate' => $this->date->format('Y-m-d'),
            'status' => $this->status,
        ];
    }


}
