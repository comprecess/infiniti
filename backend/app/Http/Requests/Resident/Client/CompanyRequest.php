<?php

namespace App\Http\Requests\Resident\Client;

use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CompanyRequest extends FormRequest implements ConvertingPropertiesInterface
{

    use ConvertingPropertiesTrait;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
//        $rule = Rule::unique('sys_companies', 'code');
//        if($model = $this->route('company')) {
//            $rule->ignore($model->id);
//        }
        return [
            'name' => 'required|string',
            'logo' => 'url',
            'code' => [
                'required',
                'string',
//                $rule
            ],
            'address' => 'string',
            'businessNumber' => 'string',
            'city' => 'string',
            'url' => 'url',
            'state' => 'string',
            'email' => 'email',
            'zip' => 'string',
            'phone' => 'string',
            'country' => 'string',
        ];
    }

    public function getListProperties(): array
    {
        return ['name' => 'company_name', 'code', 'address' => 'address1', 'businessNumber' => 'business_number', 'city', 'url', 'state', 'email', 'zip', 'phone'];
    }
}
