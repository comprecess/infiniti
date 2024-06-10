<?php

namespace App\Http\Resources;

use App\Http\Resources\Contracts\ListInterface;
use App\Http\Resources\Traits\ListTrait;
use App\Models\Users\Client;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource implements ListInterface
{
    use ListTrait;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
//        return parent::toArray($request);

        $resource = [
            'id' => $this->id,
            'userType' => $this->getNameClass(),
        ];

        $this->setList($resource);


        return $resource;
    }

    public function getList(): array
    {
        if($this->getNameClass() == (new Client())->getNameClass()) {
            return ['account', 'company', 'business_number' => 'businessNumber', 'phone', 'email', 'address', 'city', 'state', 'zip', 'country', 'balance', 'notes', 'tags', 'img', 'lastlogin' => 'lastLogin'];
        } else {
            return ['username' => 'email', 'fullname' => 'account', 'phonenumber' => 'businessNumber', 'last_activity' => 'lastActivity', 'img', 'roleid' => 'roleId', 'role', 'language', 'job_title' => 'jobTitle', 'pay_frequency' => 'payFrequency', 'currency', 'amount', 'address_line_1' => 'addressLine1', 'address_line_2' => 'addressLine2', 'city', 'state', 'zip', 'country', 'summary'];
        }

    }
}
