<?php

namespace App\Http\Resources\Resident\Settings\Admin;

use App\Http\Resources\Resident\Settings\DepartmentResource;
use App\Http\Resources\Resident\Settings\RoleResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminListResource extends JsonResource
{

    public function toArray(Request $request): array
    {

        return [
            'id' => $this->id,
            'img' => $this->getAvatar(true) ?? "",
            'fullName' => $this->fullname,
            'email' => $this->username,
            'phoneNumber' => $this->phonenumber,
            'city' => $this->city,
            'state' => $this->state,
            'zip' => $this->zip,
            'country' => $this->country,
            'role' => new RoleResource($this->myRole),
            'departments' => DepartmentResource::collection($this->departments)
        ];
    }
}
