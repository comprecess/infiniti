<?php

namespace App\Http\Resources\Resident\Orders;

use App\Http\Resources\Resident\Client\ClientResource;
use App\Models\Config;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderListClientResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $format = Config::get('df');
        return [
            'id' => $this->id,
            'orderNum' => $this->ordernum,
            'amount' => $this->printPrice('amount'),
            'status' => $this->status,
            'dateAdded' => $this->date_added->format($format),
        ];
    }


}
