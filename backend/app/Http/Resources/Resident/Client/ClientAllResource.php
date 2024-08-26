<?php

namespace App\Http\Resources\Resident\Client;

use App\Http\Resources\Resident\Client\ClientView\CustomFieldsResource;
use App\Http\Resources\Resident\Settings\CurrencyResorce;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientAllResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'img' => $this->getAvatar(true),
            'account' => $this->account,
            'code' => $this->code,
            'company' => new CompanyResource($this->companyClient),
            'group' => new GroupResource($this->group),
            'secondaryEmail' => $this->second_email,
            'ownerId' => $this->o,
            'businessNumber' => $this->business_number,
            'address' => $this->address,
            'city' => $this->city,
            'state' => $this->state,
            'zip' => $this->zip,
            'country' => $this->country,
            'currency' => new CurrencyResorce($this->getCurrencyIso),
            'email' => $this->email,
            'phone' => $this->phone,
            'displayName' => $this->display_name,
            'userName' => $this->username,
            'type' => $this->type,
            'customFields' => CustomFieldsResource::collection($this->getCustomFieldsValues()),
        ];
    }


}
