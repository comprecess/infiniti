<?php

namespace App\Http\Requests\Resident\Transactions;

use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Http\Requests\Interfaces\ModelInterface;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use App\Http\Requests\Traits\ModelTrait;
use App\Models\Resident\Settings\Currency;
use App\Models\Users\Admin;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AccountRequest extends FormRequest implements ConvertingPropertiesInterface, ModelInterface
{
    use ConvertingPropertiesTrait, ModelTrait;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */

    public function rules(): array
    {
        $rules = [
            'name' => 'required|unique:sys_accounts,account',
            'description' => 'nullable',
            'accountNumber' => 'nullable',
            'contactPerson' => 'nullable',
            'contactPhone' => 'nullable',
            'url' => 'nullable',
        ];

        if($this->getMethod() == 'POST') {
            $rules = array_merge($rules, [
                'balance' => 'nullable|array',
                'balance.*.amount' => 'numeric',
                'balance.*.currency' => [
                    'required',
                    'integer',
                    Rule::exists('sys_currencies', 'id')
                ],
            ]);

            $this->setRule($rules)
                ->applyModel('owner', true);
        }


        return $rules;
    }


    public function getListProperties(): array
    {
        $list =  [
            'name' => 'account',
            'description',
            'accountNumber' => 'account_number',
            'contactPerson' => 'contact_person',
            'contactPhone' => 'contact_phone',
            'url' => 'ib_url',
        ];

        if($this->getMethod() == 'POST') {
            $list['owner'] = 'owner_id';
        }

        return $list;
    }

    public function getListPropertiesModel(): array
    {
        return [
            'currency' => Currency::class,
            'owner' => Admin::class,
        ];
    }

}
