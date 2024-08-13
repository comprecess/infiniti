<?php

namespace App\Http\Resources\Resident\Client\CompanyView;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
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
            'orderNum' => $this->ordernum,
            'dateAdded' => $this->date_added->format('d/m/Y'),
            'account' => $this->cname,
            'client' => new ClientResource($this->user),
            'amount' => $this->amount,
            'status' => $this->status,
        ];
    }


}
