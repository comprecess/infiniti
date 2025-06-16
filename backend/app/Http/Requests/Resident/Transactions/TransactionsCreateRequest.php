<?php

namespace App\Http\Requests\Resident\Transactions;

use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Http\Requests\Interfaces\ModelInterface;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use App\Http\Requests\Traits\ModelTrait;
use App\Models\BusinessModel\Prop;
use App\Models\Resident\Client\Company;
use App\Models\Resident\Project\Project;
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

class TransactionsCreateRequest extends FormRequest implements ConvertingPropertiesInterface, ModelInterface
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
        $type = $request->getType();

        $status = [Transaction::STATUS[0], Transaction::STATUS[1]];
        if($this->referralLink) {
            if(Transaction::where('ref', $this->referralLink)
                ->where('type', $type)
                ->where('date', $this->date)
                ->count()
            ){
                throw ValidationException::withMessages(['referralLink' => "A transaction has been opened for this link and date."]);
            }
        }

        $rules = [
            'referralLink' => 'nullable',
            'code' => 'nullable',
            'tags' => 'nullable|array',
            'tags.*' => 'required|string',
            'date' => 'required|date_format:Y-m-d',
            'amount' => 'required|decimal:2',
            'attachments' => 'nullable',
            'description' => 'required',
            'status' => 'required|in:' . implode(',', $status),
            'file' => 'nullable|extensions:jepg,jpg,png,pdf,doc,docx,xml,xmlx',

        ];

        $this->setRule($rules)
            ->applyModel('account', true)
            ->applyModel('currency', true)
            ->applyModel('payMethods')
            ->applyModel('category', false, 'id', function($rule) use($type){
                $rule->where('type', $type);
            })
            ->applyModel('company')
            ->applyModel('staff')
            ->applyModel('client')
            ->applyModel('project');

        return $rules;
    }


    public function getListProperties(): array
    {
        return [
            'referralLink' => 'ref',
            'currency' => 'currency_iso_code',
            'payMethods' => 'method',
            'category' => 'cat_id',
            'code',
            'date',
            'amount',
            'attachments',
            'description',
            'status',
            'company' => 'company_id',
            'staff' => 'staff_id',
            'client' => 'payerid',
            'project' => 'project_id'
        ];
    }

    public function getListPropertiesValue() :array
    {
        $columModelSet = [
            'currency' => ['iso_code', null],
            'payMethods' => ['name', null],
            'client' => ['id', 0],
            'company' => ['id', 0],
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
            'account' => Account::class,
            'currency' => Currency::class,
            'payMethods' => PayMethods::class,
            'category' => Category::class,
            'company' => Company::class,
            'staff' => Admin::class,
            'client' => Client::class,
            'project' => Project::class
        ];
    }

    public function getAmount()
    {
        return (float) $this->amount ?? 0;
    }
}
