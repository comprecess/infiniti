<?php

namespace App\Http\Resources\Users;

use App\Http\Resources\Contracts\ListInterface;
use App\Http\Resources\Resident\Settings\RoleResource;
use App\Http\Resources\Traits\ListTrait;
use App\Models\Users\Admin;
use App\Models\Users\Client;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminListResource extends JsonResource implements ListInterface
{
    use ListTrait;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $resource = [];
        $this->setList($resource);

        return $resource;
    }

    public function getList(): array
    {
        return ['id','username' => 'email', 'fullname' => 'account', 'phonenumber' => 'businessNumber'];

    }
}
