<?php

namespace App\Http\Resources\Resident\Transactions;


use App\Http\Resources\Resident\Client\CompanyResource;
use App\Models\Config;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionsListResource extends JsonResource
{

    public function toArray(Request $request): array
    {

        return [
            'id' => $this->id,
            'code' => $this->code,
            'date' => $this->date?->format(Config::get('df')),
            'account' => $this->account,
            'type' => $this->type,
            'amount' => $this->printPrice('amount'),
            'description' => $this->description,
            'cr' => $this->printPrice('cr'),
            'dr' => $this->printPrice('dr'),
        ];
    }

}
