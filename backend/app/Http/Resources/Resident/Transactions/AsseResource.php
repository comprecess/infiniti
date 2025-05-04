<?php

namespace App\Http\Resources\Resident\Transactions;


use App\Http\Resources\Resident\Client\CompanyResource;
use App\Models\Config;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AsseResource extends JsonResource
{

    public function toArray(Request $request): array
    {

        return [
            'id' => $this->id,
            'name' => $this->name,
            'datePurchased' => $this->date_purchased?->format("Y-m-d"),
            'supportedUntil' => $this->supported_until?->format("Y-m-d"),
            'price' => $this->price,
            'serial' => $this->serial,
            'notes' => $this->notes,
            'category' => new AssetCategoryResource($this->category)
        ];


    }

}
