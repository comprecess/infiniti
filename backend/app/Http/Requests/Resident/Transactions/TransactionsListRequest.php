<?php

namespace App\Http\Requests\Resident\Transactions;

use App\Http\Requests\Interfaces\ModelInterface;
use App\Http\Requests\Resident\DocumentRequest;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use App\Http\Requests\Traits\ModelTrait;
use App\Models\Resident\Transactions\Account;
use App\Models\Resident\Transactions\Category;
use App\Models\Resident\Transactions\Transaction;
use App\Models\Users\Client;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Arr;

class TransactionsListRequest extends DocumentRequest implements ModelInterface
{
    use ConvertingPropertiesTrait, ModelTrait;

    const TYPE = [Transaction::TYPE[0], Transaction::TYPE[1], 'Transfer', 'Equity'];

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */

    public function sort() :array
    {
        return [
            'id' => 'sys_transactions.id',
            'code' => 'sys_transactions.code',
            'date' => 'sys_transactions.date',
            'account' => 'sys_transactions.account',
            'type' => 'sys_transactions.type',
            'amount' => 'sys_transactions.amount',
            'description' => 'sys_transactions.description'
        ];
    }

    public function rules(): array
    {

        $rules = array_merge([
            'filter.type' => 'nullable|in:' . implode(',', self::TYPE),
            'filter.date' => 'nullable|array',
            'filter.date.*' => 'required|date_format:Y-m-d',
            'filter.status' => 'nullable|in:' . implode(',', Transaction::STATUS)
        ], parent::rules());

        $this->setRule($rules)
            ->applyModel('filter.account')
            ->applyModel('filter.client')
            ->applyModel('filter.category');

        return $rules;
    }

    public function getListPropertiesModel(): array
    {
        return [
            'filter.account' => Account::class,
            'filter.client' => Client::class,
            'filter.category' => Category::class,
        ];
    }

    public function getDate():array
    {
        $data = Arr::get($this->all(), 'filter.date');
        if($data) {
            return [Arr::first($data), Arr::last($data)];
        }else{
            return [];
        }
    }
}
