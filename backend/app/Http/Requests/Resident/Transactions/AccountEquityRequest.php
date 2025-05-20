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

class AccountEquityRequest extends FormRequest
{
    use ConvertingPropertiesTrait, ModelTrait;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */

    public function rules(): array
    {
        return [
                'balance' => 'nullable|array',
                'balance.*.amount' => 'required|numeric',
                'balance.*.currency' => [
                    'required',
                    'integer',
                    Rule::exists('sys_currencies', 'id')
                ],
            ];
    }


}
