<?php

namespace App\Http\Requests\Resident\Client;

use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use App\Models\Users\Client;
use App\Services\Tools\Countries;
use Illuminate\Foundation\Http\FormRequest;

class ClientCreateRequest extends FormRequest implements ConvertingPropertiesInterface
{
    use ConvertingPropertiesTrait;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */

    public function rules(): array
    {
        $client = $this->route('client');
        $unique = $client?->id ? ','.$client->id : '';
        $isPost = $this->method() == 'POST';
        $rules = [
            'account' => "required",
//            'email' => "nullable|email",
            'email' => 'required|email|unique:App\Models\Users\Client,email' . $unique,
            'phone' => 'nullable|unique:App\Models\Users\Client,phone' . $unique,
            'code' => 'nullable|unique:App\Models\Users\Client,code' . $unique,
            'password' => 'min:6|nullable|required_with:confirmationPassword|same:confirmationPassword',
            'confirmationPassword' => 'min:6|nullable|required_with:confirmationPassword|same:confirmationPassword',
            'secondaryEmail' => "nullable|email",
            'companyId' => 'nullable|integer|exists:sys_companies,id',
            'currency' => 'nullable|string|exists:sys_currencies,iso_code',
            'groupId' => 'nullable|integer|exists:crm_groups,id',
            'ownerId' => 'nullable|integer|exists:sys_users,id',
            'type' => 'array|required',
            'type.*' => 'required|in:' . implode(",", Client::TYPE),
            'country' => "nullable|string|in:" . implode(",", array_keys(Countries::list())),
            'customFields' => 'array|nullable',
        ];

        if(!$isPost) {
            unset($rules['confirmationPassword']);
            $rules['password'] = 'min:6|nullable';
        }

        return $rules;
    }


    public function getListProperties(): array
    {
        return [
            'account',
            'email',
            'code',
            'secondaryEmail' => 'secondary_email',
            'displayName' => 'display_name',
            'phone',
            'companyId' => 'cid',
            'businessNumber' => 'business_number',
            'groupId' => 'gid',
            'type',
            'ownerId' => 'o',
            'address',
            'userName' => 'username',
            'city',
            'state',
            'zip',
            'country'
        ];
    }
}
