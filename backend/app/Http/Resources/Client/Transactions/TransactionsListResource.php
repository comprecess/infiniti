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
            'date' => $this->date?->format(Config::get('df')),
            'account' => $this->account,
//            'amount' => $this->transformPrice('amount', $user->getCurrencyIso, true),
            'amount' => $this->printPrice('amount', $this->getCurrencyIso),
            'description' => $this->description,
        ];
    }
}
