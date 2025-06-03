<?php

namespace App\Http\Requests\Resident\Transactions;

use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Http\Requests\Interfaces\ModelInterface;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use App\Http\Requests\Traits\ModelTrait;
use App\Models\Resident\Client\Company;
use App\Models\Resident\Transactions\Category;
use App\Models\Resident\Transactions\PayMethods;
use App\Models\Resident\Transactions\Transaction;
use App\Models\Users\Admin;
use App\Models\Users\Client;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;

class TransactionsUpdateRequest extends FormRequest implements ConvertingPropertiesInterface, ModelInterface
{
    use ConvertingPropertiesTrait, ModelTrait;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */

    public function rules(): array
    {
        $request = app(TransactionsTypeRequest::class);
        $type = $typeLink = $request->getType();
        $transaction = $this->route('transaction');
        if($transaction->id) {
            $typeLink = $transaction->type;
        }

        if($this->referralLink) {
            if(Transaction::where('ref', $this->referralLink)
                ->where('type', $typeLink)
                ->where('date', $this->date)
                ->count()
            ){
                throw ValidationException::withMessages(['referralLink' => "A transaction has been opened for this link and date."]);
            }
        }

        $rules = [
            'referralLink' => 'nullable',
            'tags' => 'nullable|array',
            'tags.*' => 'required|string',
            'date' => 'required|date_format:Y-m-d',
            'attachments' => 'nullable',
            'description' => 'required',

        ];

        $this->setRule($rules)
            ->applyModel('payMethods')
            ->applyModel('category', false, 'id', function($rule) use($type){
                $rule->where('type', $type);
            })
            ->applyModel('staff')
            ->applyModel('client');

        return $rules;
    }


    public function getListProperties(): array
    {
        return [
            'referralLink' => 'ref',
            'payMethods' => 'method',
            'category' => 'cat_id',
            'date',
            'attachments',
            'description',
            'status',
            'staff' => 'staff_id',
            'client' => 'payerid'
        ];
    }

    public function getListPropertiesValue() :array
    {
        $columModelSet = [
            'payMethods' => ['name', null],
            'client' => ['id', 0],
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
            'payMethods' => PayMethods::class,
            'category' => Category::class,
            'staff' => Admin::class,
            'client' => Client::class
        ];
    }

    public function getAmount()
    {
        return (float) $this->amount ?? 0;
    }
}
