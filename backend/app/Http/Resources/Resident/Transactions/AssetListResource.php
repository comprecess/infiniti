<?php

namespace App\Http\Resources\Resident\Transactions;


use App\Http\Resources\Resident\Client\CompanyResource;
use App\Models\Config;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssetListResource extends JsonResource
{

    public function toArray(Request $request): array
    {

        return [
            'id' => $this->id,
            'name' => $this->name,
            'datePurchased' => $this->date_purchased?->format(Config::get('df')),
            'supportedUntil' => $this->supported_until?->format(Config::get('df')),
            'price' => $this->printPrice('price'),
        ];
    }

}
