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
            'description' => 'sys_transactions.description',
            'dr' => 'sys_transactions.dr',
            'cr' => 'sys_transactions.cr',
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

    public function filter($transactionQuery)
    {
        $data = $this->all();

        if($type = Arr::get($data, 'filter.type')) {
            if($type == TransactionsListRequest::TYPE[2]) {
                $transactionQuery->whereIn('type', [Transaction::TYPE[2], Transaction::TYPE[3]]);
            }else{
                $transactionQuery->where('type', $type);
            }
        }

        if($status = Arr::get($data, 'filter.status')) {
            $transactionQuery->where('status', $status);
        }

        if($search = Arr::get($data, 'filter.search')) {
            $search = "%{$search}%";
            $transactionQuery->where(function($query) use($search){
                $query->where('id', 'like', $search)
                    ->orWhere('code', 'like', $search)
                    ->orWhere('account', 'like', $search)
                    ->orWhere('type', 'like', $search)
                    ->orWhere('amount', 'like', $search)
                    ->orWhere('description', 'like', $search);
            });
        }

        if($account = $this->getModel('filter.account')) {
            $transactionQuery->where('account_id', $account->id);
        }

        if($category = $this->getModel('filter.category')) {
            $transactionQuery->where('cat_id', $category->id);
        }

        if($client = $this->getModel('filter.client')) {
            $transactionQuery->where(function($query) use($client){
                $query->where('payerid', $client->id)->orWhere('payeeid', $client->id);
            });
        }

        if($date = $this->getDate()) {
            $transactionQuery->whereBetween('date', $date);
        }

        $transactionQuery->with(['getCurrencyIso']);

        $this->sortModel($transactionQuery);
    }
}
