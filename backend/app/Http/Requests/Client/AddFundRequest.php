<?php

namespace App\Http\Requests\Client;

use App\Models\Config;
use App\Models\Log;
use App\Models\Resident\Settings\Currency;
use App\Models\User;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class AddFundRequest extends FormRequest
{

    public function transform($price)
    {
        $user = User::getAuth();
        $defCurrency = Currency::getDefault();
        $currency = $user->getCurrencyIso ?? $defCurrency;

        return $defCurrency->transform($price, $currency);
    }

    public function rules(): array
    {

        $min = $this->transform((int) Config::get('add_fund_minimum_deposit'));
        $max = $this->transform((int) Config::get('add_fund_maximum_deposit'));

        return [
            'amount' => "required|numeric|min:{$min}|max:{$max}"
        ];

    }

    protected function failedValidation(Validator $validator)
    {
        $min = $this->transform((int) Config::get('add_fund_minimum_deposit'));
        $max = $this->transform((int) Config::get('add_fund_maximum_deposit'));

        Log::send("Amount shoule be between - {$min} to {$max}");

        parent::failedValidation($validator);
    }
}
