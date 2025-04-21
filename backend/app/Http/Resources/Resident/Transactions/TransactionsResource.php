<?php

namespace App\Http\Resources\Resident\Transactions;


use App\Http\Resources\Resident\Client\CompanyResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionsResource extends JsonResource
{

    public function toArray(Request $request): array
    {

        return [
            'id' => $this->id,
            'account' => $this->account,
            'description' => $this->description,
            'code' => $this->code,
            'company' => new CompanyResource($this->company),
            'amount' => $this->printPrice('amount')
        ];
    }

}
