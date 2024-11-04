<?php

namespace App\Http\Requests\Resident\Talents;

use App\Http\Requests\Resident\DocumentRequest;
use App\Models\Catalog\Value;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;


class CartListRequest extends DocumentRequest
{
    const TYPE = [
        'recently',
        'my',
        'all'
    ];

    public function sort() :array
    {
        return [
            'id' => 'catalog_cart.id',
            'name' => 'sortName',
            'total' => 'catalog_cart.total',
        ];
    }


    public function rules(): array
    {
        if(!$this->isDocument() && request()->get('document')) {
            throw ValidationException::withMessages(["serviceId" => __('validation.declined', ['attribute' => "document"])]);
        }

        return [
            'filter.search' => "nullable|string",
            'filter.type' => "nullable|in:" . implode(",", self::TYPE),
            'sort.name' => "nullable|in:" . implode(",", array_keys($this->sort())),
            'document' => "nullable|in:" . implode(",", self::DOCUMENT),
        ];
    }

    public function sortName($query)
    {
        $name = $this->sort['name'];
        $desc = isset($this->sort['type']) ? (bool) $this->sort['type'] : true;
        //$desc ? "desc" : 'asc'
       $query->orderByRaw('IF (`crm_accounts`.`account` IS NULL, `sys_users`.`fullname` ,`crm_accounts`.`account`)');
    }

}
