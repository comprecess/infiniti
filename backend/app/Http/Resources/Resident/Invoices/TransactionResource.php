<?php

namespace App\Http\Resources\Resident\Invoices;


use App\Models\Config;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        $format = Config::get('df');
        return [
            'date' => $this->date->format($format),
            'account' => $this->account,
            'amount' => $this->printPrice('amount'),
            'description' => $this->description,
        ];
    }

}
