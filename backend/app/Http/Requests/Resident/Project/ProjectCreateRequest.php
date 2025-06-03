<?php

namespace App\Http\Requests\Resident\Project;

use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Http\Requests\Interfaces\ModelInterface;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use App\Http\Requests\Traits\ModelTrait;
use App\Models\Resident\Project\Project;
use App\Models\Resident\Settings\Currency;
use App\Models\Resident\Transactions\Transaction;
use App\Models\Users\Admin;
use App\Models\Users\Client;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;

class ProjectCreateRequest extends FormRequest implements ConvertingPropertiesInterface, ModelInterface
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
            'name' => 'required',
            'summary' => 'nullable',
            'startDate' => 'nullable|date_format:Y-m-d',
            'dueDate' => 'nullable|date_format:Y-m-d',
            'status' => 'required|in:' . implode(',', Project::STATUS),
            'type' => 'required|in:' . implode(',', Project::TYPE),
            'teamMember' => 'nullable|array',

        ];

        $this->setRule($rules)
            ->applyModel('owner')
            ->applyModel('staff')
            ->applyModel('client')
            ->applyModel('currency', true);

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
            'client' => 'payerid'
        ];
    }

    public function getListPropertiesValue() :array
    {
        $columModelSet = [
            'currency' => ['iso_code', null],
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
            'currency' => Currency::class,
            'owner' => Admin::class,
            'staff' => Admin::class,
            'client' => Client::class
        ];
    }
}
