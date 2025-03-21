<?php

namespace App\Http\Resources\Resident\Invoices;


use App\Models\Config;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AccountInfoResource extends JsonResource
{

    public function toArray(Request $request): array
    {

        return [
            'id' => $this->id,
            'name' => $this->account,
            'balance' => $this->balance,
        ];
    }

}
