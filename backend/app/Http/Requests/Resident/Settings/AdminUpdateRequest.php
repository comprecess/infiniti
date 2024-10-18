<?php

namespace App\Http\Requests\Resident\Settings;


use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use Illuminate\Foundation\Http\FormRequest;


class AdminUpdateRequest extends FormRequest implements ConvertingPropertiesInterface
{
    use ConvertingPropertiesTrait;

    public function rules(): array
    {
        return [
            'department' => "nullable|exists:sys_ticketdepartments,id",
            'emailNotify' => "nullable|boolean",
            'smsNotify' => "nullable|boolean",

        ];
    }

    public function getListProperties(): array
    {
        return [
            'emailNotify' => 'email_notify',
            'smsNotify' => 'sms_notify',
        ];
    }

}
