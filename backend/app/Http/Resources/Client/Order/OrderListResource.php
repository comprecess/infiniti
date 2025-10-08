<?php

namespace App\Http\Resources\Client\Order;


use App\Models\Config;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderListResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'date' => $this->date_added?->format(Config::get('df')),
            'orderNum' => $this->ordernum,
            'amount' => $this->printPrice('amount', $this->getCurrencyIso),
            'status' => $this->status,
        ];
    }
}
