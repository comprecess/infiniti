<?php

namespace App\Http\Requests\Client;

use App\Models\Config;
use App\Models\Log;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class AddFundRequest extends FormRequest
{

    public function rules(): array
    {
        $min = Config::get('add_fund_minimum_deposit');
        $max = Config::get('add_fund_maximum_deposit');

        return [
            'amount' => "required|numeric|min:{$min}|max:{$max}"
        ];

    }

    protected function failedValidation(Validator $validator)
    {
        $min = Config::get('add_fund_minimum_deposit');
        $max = Config::get('add_fund_maximum_deposit');

        Log::send("Amount shoule be between - {$min} to {$max}");

        parent::failedValidation($validator);
    }
}
