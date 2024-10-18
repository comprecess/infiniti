<?php

namespace App\Http\Resources\Resident\Settings\Admin;

use App\Http\Resources\Resident\Settings\DepartmentResource;
use App\Http\Resources\Resident\Settings\RoleResource;
use App\Models\Resident\Settings\Role;
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
            'language' => $this->language,
            'address' => $this->address,
            'city' => $this->city,
            'state' => $this->state,
            'jobTitle' => $this->job_title,
            'payFrequency' => $this->pay_frequency,
            'zip' => $this->zip,
            'country' => $this->country,
            'dateHired' => $this->date_hired?->format('Y-m-d'),
            'amount' => $this->amount,
            'summary' => $this->summary,
            'role' => new RoleResource($this->myRole ?? Role::getForSelect()->first()),
            'departments' => DepartmentResource::collection($this->departments),
            'emailNotify' => $this->email_notify,
            'smsNotify' => $this->sms_notify,
        ];
    }
}
