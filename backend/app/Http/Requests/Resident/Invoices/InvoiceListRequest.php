<?php

namespace App\Http\Requests\Resident\Client;

use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class InvoiceListRequest extends FormRequest
{
    const SORT = [
        'id' => 'sys_invoices.id',
        'account' => 'crm_account.account',
        'name' => 'crm_accounts.account',
        'company' => 'sys_companies.company_name',
        'group' => 'crm_groups.gname',
        'email' => 'crm_accounts.email',
        'phone' => 'crm_accounts.phone'
    ];
    const DOCUMENT = ['json', 'pdf', 'excel', 'csv', 'copy'];



    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */

    public function rules(): array
    {
        return [
            'filter.group' => "nullable|exists:crm_groups,id",
            'filter.search' => "nullable|string",
            'sort.name' => "nullable|in:" . implode(",", array_keys(self::SORT)),
            'document' => "nullable|in:" . implode(",", self::DOCUMENT),
        ];
    }

    public function sortModel($model)
    {
        $desc = isset($this->sort['type']) ? (bool) $this->sort['type'] : true;
        $model->orderBy(self::SORT[$this->sort['name'] ?? 'id'], $desc ? "desc" : 'asc');
    }


}
