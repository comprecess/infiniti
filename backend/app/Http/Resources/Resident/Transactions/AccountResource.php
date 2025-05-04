<?php

namespace App\Http\Resources\Resident\Transactions;


use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AccountResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->account,
            'description' => $this->description,
            'accountNumber' => $this->account_number,
            'contactPerson' => $this->contact_person,
            'contactPhone' => $this->contact_phone,
            'url' => $this->ib_url,
        ];
    }

}
