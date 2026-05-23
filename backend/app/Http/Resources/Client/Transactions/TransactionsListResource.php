<?php

namespace App\Http\Resources\Client\Transactions;


use App\Models\Config;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionsListResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'date'        => $this->date?->format(Config::get('df')),
            'account'     => $this->account,
            'type'        => $this->type,
            'category'    => $this->category,
//            'amount' => $this->transformPrice('amount', $user->getCurrencyIso, true),
            'amount'      => $this->printPrice('amount', $this->getCurrencyIso),
            'description' => $this->description,
        ];
    }
}
