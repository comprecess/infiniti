<?php

namespace App\Http\Requests\Resident\Project;

use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Http\Requests\Interfaces\ModelInterface;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use App\Http\Requests\Traits\ModelTrait;
use App\Models\Resident\Project\Project;
use App\Models\Resident\Settings\Currency;
use App\Models\Users\Admin;
use App\Models\Users\Client;
use Illuminate\Foundation\Http\FormRequest;

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
            'members' => 'nullable|array',
            'members.*' => 'required|integer|exists:sys_users,id',
            'suppliers' => 'nullable|array',
            'suppliers.*' => 'required|integer|exists:crm_accounts,id',
            'budget' => 'nullable|numeric',
            'description' => 'nullable',
            'templateCode' => 'nullable|string|max:50|exists:clx_project_templates,code',
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
            'name',
            'summary',
            'owner' => 'admin_id',
            'staff' => 'project_manager_id',
            'client' => 'contact_id',
            'startDate' => 'start_date',
            'dueDate' => 'due_date',
            'type' => 'billing_type',
            'status',
            'currency',
            'budget',
            'description',
            'members',
            'templateCode' => 'template_code'
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
