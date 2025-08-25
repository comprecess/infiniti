<?php

namespace App\Http\Resources;

use App\Http\Resources\Contracts\ListInterface;
use App\Http\Resources\Resident\Settings\RoleResource;
use App\Http\Resources\Traits\ListTrait;
use App\Models\Users\Admin;
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

        $resource = [
            'id' => $this->id,
            'userType' => $this->getNameClass(),
        ];

        $this->setList($resource);
        $resource['img'] = $this->getAvatar(true) ?? "";
//        if($this->getNameClass() == (new Client())->getNameClass()) {
//            $resource['company'] = $this->companyClient?->company_name;
//        }

        if($this->resource instanceof Admin){
            $resource['role'] = $this->myRole?->getRoleAccess();
        }else{
            $resource['balance'] = $this->printPrice('balance');
            $resource['company'] = $this->companyClient?->company_name;
        }

        return $resource;
    }

    public function getList(): array
    {
        if($this->getNameClass() == (new Client())->getNameClass()) {
            return ['account', 'company', 'business_number' => 'businessNumber', 'phone', 'email', 'address', 'city', 'state', 'zip', 'country', 'notes', 'tags', 'img', 'lastlogin' => 'lastLogin'];
        } else {
            return ['username' => 'email', 'fullname' => 'account', 'phonenumber' => 'businessNumber', 'last_activity' => 'lastActivity', 'img', 'roleid' => 'roleId', 'role', 'language', 'job_title' => 'jobTitle', 'pay_frequency' => 'payFrequency', 'currency', 'amount', 'address_line_1' => 'addressLine1', 'address_line_2' => 'addressLine2', 'city', 'state', 'zip', 'country', 'summary'];
        }

    }
}
