<?php

namespace App\Http\Requests\Resident\Transactions;

use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Http\Requests\Interfaces\ModelInterface;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use App\Http\Requests\Traits\ModelTrait;
use App\Models\Resident\Settings\Currency;
use App\Models\Resident\Transactions\Account;
use App\Models\Resident\Transactions\Bill;
use App\Models\Resident\Transactions\Category;
use App\Models\Users\Client;
use Illuminate\Foundation\Http\FormRequest;

class BillCreateRequest extends FormRequest implements ConvertingPropertiesInterface, ModelInterface
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
            'title' => 'required',
            'nextDate' => 'required|date_format:Y-m-d',
            'amount' => 'required|decimal:2',
            'recurringType' => 'required|in:'. implode(',', Bill::RECURRING_TYPE),
            'website' => 'nullable|string',
        ];

        $this->setRule($rules)
            ->applyModel('currency', true)
            ->applyModel('account')
            ->applyModel('category', false, 'id', function($rule){
                $rule->where('type', Category::TYPE[0]);
            })
            ->applyModel('client');

        return $rules;
    }


    public function getListProperties(): array
    {
        return [
            'title',
            'currency',
            'nextDate' => 'next_date',
            'category' => 'category_id',
            'amount' => 'net_amount',
            'recurringType' => 'recurring_type',
            'website',
            'account' => 'from_account_id',
            'client' => 'contact_id'
        ];
    }

    public function getListPropertiesValue() :array
    {
        $columModelSet = [
            'currency' => ['iso_code', null]
        ];
        $value = [];

        foreach($columModelSet as $key => $val) {
            $value[$key] = $this->getModel($key)?->{$val[0]} ?? $val[1];
        }

        return $value;
    }

    public function getListPropertiesModel(): array
    {
        return [
            'account' => Account::class,
            'currency' => Currency::class,
            'client' => Client::class,
            'category' => Category::class,
        ];
    }

    public function getAmount()
    {
        return (float) $this->amount ?? 0;
    }
}
