<?php

namespace App\Http\Resources;

use App\Http\Resources\Contracts\ListInterface;
use App\Http\Resources\Resident\Settings\RoleResource;
use App\Http\Resources\Traits\ListTrait;
use App\Models\Users\Admin;
use App\Models\Users\Client;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserSmallResource extends JsonResource implements ListInterface
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


        return $resource;
    }

    public function getList(): array
    {
        if($this->getNameClass() == (new Client())->getNameClass()) {
            return ['account', 'company', 'business_number' => 'businessNumber', 'phone', 'email', 'lastlogin' => 'lastActivity'];
        } else {
            return ['username' => 'email', 'fullname' => 'account', 'phonenumber' => 'businessNumber', 'last_login' => 'lastActivity'];
        }

    }
}
