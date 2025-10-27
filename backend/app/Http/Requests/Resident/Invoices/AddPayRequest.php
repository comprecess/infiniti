<?php

namespace App\Http\Requests\Resident\Invoices;



use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Http\Requests\Interfaces\ModelInterface;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use App\Http\Requests\Traits\ModelTrait;
use App\Models\Resident\Settings\Currency;
use App\Models\Resident\Transactions\Account;
use App\Models\Resident\Transactions\Category;
use App\Models\Resident\Transactions\PayMethods;
use App\Models\Users\Admin;
use App\Models\Users\Client;
use Illuminate\Foundation\Http\FormRequest;


class AddPayRequest extends FormRequest implements ModelInterface
{
    use ConvertingPropertiesTrait, ModelTrait;

    public function rules(): array
    {

        $rules = [
//            'account' => "required|exists:sys_accounts,id",
            'description' => "required",
            'amount' => 'required|integer|min:0',
            'date' => "nullable|date_format:Y-m-d",
        ];

        $this->setRule($rules)
            ->applyModel('account', true)
            ->applyModel('method')
            ->applyModel('category');

        return $rules;
    }

    public function getListPropertiesModel(): array
    {
        return [
            'account' => Account::class,
            'category' => Category::class,
            'method' => PayMethods::class,
        ];
    }

}
