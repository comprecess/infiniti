<?php

namespace App\Http\Requests\Resident\Client;

use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use App\Models\Users\Client;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ClientListRequest extends FormRequest
{
    const SORT = [
        'id' => 'crm_accounts.id',
        'img' => 'file_storages.id',
        'name' => 'crm_accounts.account',
        'company' => 'sys_companies.company_name',
        'group' => ['crm_groups.gname', ['crm_accounts.id', 'DESC']],
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
            'type' => "nullable|in:" . implode(",", Client::TYPE)
        ];
    }

    public function sortModel($model)
    {
        $desc = isset($this->sort['type']) ? (bool) $this->sort['type'] : true;
        $column = self::SORT[$this->sort['name'] ?? 'id'];
        if(is_array($column)) {
            $model->orderBy($column[0], $desc ? "desc" : 'asc');
            for($i = 1; $i < count($column); $i++) {
                $model->orderBy($column[$i][0], $column[$i][1]);
            }
        }else {
            $model->orderBy($column, $desc ? "desc" : 'asc');
        }
    }


}
