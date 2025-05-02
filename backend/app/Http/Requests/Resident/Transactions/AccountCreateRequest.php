<?php

namespace App\Http\Requests\Resident\Transactions;

use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Http\Requests\Interfaces\ModelInterface;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use App\Http\Requests\Traits\ModelTrait;
use App\Models\BusinessModel\Prop;
use App\Models\Resident\Client\Company;
use App\Models\Resident\Settings\Currency;
use App\Models\Resident\Transactions\Account;
use App\Models\Resident\Transactions\Category;
use App\Models\Resident\Transactions\PayMethods;
use App\Models\Resident\Transactions\Transaction;
use App\Models\Users\Admin;
use App\Models\Users\Client;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AccountCreateRequest extends FormRequest implements ConvertingPropertiesInterface, ModelInterface
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
            'balance' => 'nullable|array',
            'balance.*.amount' => 'required|numeric',
            'balance.*.currency' => [
                'required',
                'integer',
                Rule::exists('sys_currencies', 'id')
            ],
//            'balance' => 'nullable|numeric',

        ];

        $this->setRule($rules)
            ->applyModel('owner', true);

        return $rules;
    }


    public function getListProperties(): array
    {
        return [
            'name' => 'account',
            'description',
            'accountNumber' => 'account_number',
            'contactPerson' => 'contact_person',
            'contactPhone' => 'contact_phone',
            'url' => 'ib_url',
            'owner' => 'owner_id'
        ];
    }

    public function getListPropertiesModel(): array
    {
        return [
            'currency' => Currency::class,
            'owner' => Admin::class,
        ];
    }

}
