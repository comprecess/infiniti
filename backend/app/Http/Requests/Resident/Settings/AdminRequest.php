<?php

namespace App\Http\Requests\Resident\Settings;


use App\Http\Controllers\Api\Resident\Settings\AdminController;
use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use App\Models\Resident\Settings\Role;
use Illuminate\Foundation\Http\FormRequest;


class AdminRequest extends FormRequest implements ConvertingPropertiesInterface
{
    use ConvertingPropertiesTrait;


    public function rules(): array
    {
        $user = $this->route('resident');
        $unique = $user?->id ? ','.$user->id : '';
        $listCode = collect(config('data.localization'))->map(function($item){
            return $item['iso_code'];
        })->implode(',');


        $rules = [
            'email' => 'required|email|unique:App\Models\Users\Admin,email' . $unique,
            'fullName' => 'required',
            'role' => 'required|in:'. Role::getForSelect()->pluck('id')->implode(',') ,
            'password' => 'required|min:6|nullable|required_with:confirmationPassword|same:confirmationPassword',
            'confirmationPassword' => 'min:6|nullable|required_with:confirmationPassword|same:confirmationPassword',
            'dateHired' => 'date_format:Y-m-d',
            'payFrequency' => 'in:' . implode(',', AdminController::PAY_FREQUENCY),
            'img' => 'image',
            'language' => 'in:' . $listCode
        ];

        if(!$this->password && $user) {
            unset($rules['password']);
            unset($rules['confirmationPassword']);
        }


        return $rules;
    }


    public function getListProperties(): array
    {
        return [
            'email' => 'username',
            'fullName' => 'fullname',
            'phoneNumber' => 'phonenumber',
            'jobTitle' => 'job_title',
            'city',
            'state',
            'zip',
            'country',
            'dateHired' => 'date_hired',
            'payFrequency' => 'pay_frequency',
            'summary'
        ];
    }
}
