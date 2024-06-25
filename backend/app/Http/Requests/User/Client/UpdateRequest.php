<?php

namespace App\Http\Requests\User\Client;

use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use Illuminate\Foundation\Http\FormRequest;

class UpdateRequest extends FormRequest implements ConvertingPropertiesInterface
{
    use ConvertingPropertiesTrait;
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $id = auth()->id();

        return [
            'account' => 'string|required',
            'company' => 'string',
            'email' => 'required|email|unique:crm_accounts,email,'.$id.',id',
            'phone' => 'string',
            'businessNumber' => 'string',
            'address' => 'string',
            'city' => 'string',
            'state' => 'string',
            'zip' => 'string',
            'country' => 'string',
            'password' => 'string',
        ];
    }

    public function getListProperties(): array
    {
        return [
            'account', 'company', 'email', 'phone', 'businessNumber' => 'business_number', 'address', 'city', 'state', 'zip', 'country',
        ];
    }
}
