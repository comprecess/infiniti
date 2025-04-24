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

class TransferRequest extends FormRequest implements ConvertingPropertiesInterface, ModelInterface
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
            'referralLink' => 'nullable',
            'tags' => 'nullable|array',
            'tags.*' => 'required|string',
            'date' => 'required|date_format:Y-m-d',
            'amount' => 'required|decimal:2',
            'attachments' => 'nullable',
            'description' => 'required',
//            'type' => 'nullable|in:' . implode(',', [Transaction::TYPE[2]]),

        ];

        $this->setRule($rules)
            ->applyModel('fromAccount', true, dopRule: function(&$ruleList){
                $ruleList[] = 'different:to_account';
            })
            ->applyModel('toAccount', true)
            ->applyModel('currency', true)
            ->applyModel('payMethods');

        return $rules;
    }


    public function getListProperties(): array
    {
        return [
            'referralLink' => 'ref',
            'currency' => 'currency_iso_code',
            'payMethods' => 'method',
            'date',
            'amount',
            'description',
        ];
    }

    public function getListPropertiesValue() :array
    {
        $columModelSet = [
            'currency' => ['iso_code', null],
            'payMethods' => ['name', null],
        ];
        $value = [];

        foreach($columModelSet as $key => $val) {
            $value[$key] = $this->getModel($key)?->{$val[0]} ?? $val[1];
        }

//        $value['client'] = $this->getModel('client')?->id ?? 0;

        return $value;
    }

    public function getListPropertiesModel(): array
    {
        return [
            'fromAccount' => Account::class,
            'toAccount' => Account::class,
            'currency' => Currency::class,
            'payMethods' => PayMethods::class,
        ];
    }

    public function getAmount()
    {
        return (float) $this->amount ?? 0;
    }
}
