<?php

namespace App\Http\Resources\Resident\Transactions;


use App\Http\Resources\Resident\Client\ClientResource;
use App\Http\Resources\Resident\Client\CompanyResource;
use App\Http\Resources\Resident\Invoices\PayMethodsResource;
use App\Http\Resources\Resident\Settings\TagResource;
use App\Http\Resources\Users\AdminListResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionsItemResource extends JsonResource
{

    public function toArray(Request $request): array
    {

        return [
            'id' => $this->id,
            'date' => $this->date->format('Y-m-d'),
            'description' => $this->description,
            'company' => new CompanyResource($this->company),
            'amount' => $this->amount,
            'amountCurrency' => $this->printPrice('amount'),
            'category' => new AssetCategoryResource($this->categoryModel),
            'tags' => TagResource::collection($this->getTagModel()),
            'payer' => new ClientResource($this->payerUser),
            'staff' => new AdminListResource($this->staff),
            'payMethods' => new PayMethodsResource($this->getPayMethods()),
            'ref' => $this->ref,
        ];
    }

}
