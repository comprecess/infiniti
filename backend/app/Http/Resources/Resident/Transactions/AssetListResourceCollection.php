<?php

namespace App\Http\Resources\Resident\Transactions;

use App\Http\Resources\Contracts\CRUDCollectionContract;
use Illuminate\Http\Request;
use App\Http\Resources\Collection\ResourceCollection;

class AssetListResourceCollection extends ResourceCollection implements CRUDCollectionContract
{

    public function toArray(Request $request): array
    {

        return [
            'data' => AssetListResource::collection($this->collection),
            'total' => $this->getData()['total']
        ];
    }

}
