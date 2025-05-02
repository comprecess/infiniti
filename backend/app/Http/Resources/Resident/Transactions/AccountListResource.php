<?php

namespace App\Http\Resources\Resident\Transactions;


use App\Models\Resident\Transactions\Transaction;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Arr;

class AccountListResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        $data = [
            'id' => $this->id,
            'name' => $this->account,
        ];

        if($this->balance){
            $transactionPrint = new Transaction();
            $transactionPrint->setCurrency($this->balance_currency);
            $balanceTotal = [];
            $balance = $this->balance;

            $balanceTotal[Transaction::TYPE[0]] = Arr::get($balance, Transaction::TYPE[0], 0) + Arr::get($balance, Transaction::TYPE[3], 0);
            $balanceTotal[Transaction::TYPE[1]] = Arr::get($balance, Transaction::TYPE[1], 0) + Arr::get($balance, Transaction::TYPE[2], 0);
            $balanceTotal[Transaction::TYPE[4]] = Arr::get($balance, Transaction::TYPE[4], 0);
            $balanceTotal['Total'] = $balanceTotal[Transaction::TYPE[0]] - $balanceTotal[Transaction::TYPE[1]];

            foreach($balanceTotal as $key => $val) {
                $transactionPrint->amount = $val;
                $balanceTotal[$key] = $transactionPrint->printPrice('amount', $this->balance_currency);
            }

            $data['balance'] = $balanceTotal;
        }

        return $data;
    }

}
