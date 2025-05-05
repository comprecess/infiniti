<?php

namespace App\Http\Resources\Resident\Transactions;


use App\Http\Resources\Resident\Client\ClientInfoResource;
use App\Http\Resources\Resident\Invoices\AccountInfoResource;
use App\Http\Resources\Resident\Invoices\CategoryInfoResource;
use App\Http\Resources\Resident\Settings\CurrencyResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BillsResource extends JsonResource
{

    public function toArray(Request $request): array
    {

        return [
            'id' => $this->id,
            'title' => $this->title,
            'nextDate' => $this->next_date->format('Y-m-d'),
            'recurringType' => $this->recurring_type,
            'currency' => new CurrencyResource($this->getCurrencyIso),
            'amount' => $this->printPrice('net_amount'),
            'amountFloat' => $this->net_amount,
            'account' => new AccountInfoResource($this->account),
            'client' => new ClientInfoResource($this->client),
            'category' => new CategoryInfoResource($this->category),
            'website' => $this->website,
            'isPaid' => $this->is_paid
        ];
    }

}
