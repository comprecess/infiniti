<?php

namespace App\Http\Requests\Resident\Settings;


use App\Http\Requests\Interfaces\SortModelInterface;
use App\Http\Requests\Traits\SortModel;
use Illuminate\Foundation\Http\FormRequest;


class AdminListRequest extends FormRequest implements SortModelInterface
{
    use SortModel;

    public function sort() :array
    {
        return [
            'id' => 'sys_users.id',
            'avatar' => 'sys_users.id',
            'details' => 'sys_users.fullname',
            'type' => 'sys_roles.rname',
            'control' => 'sys_users.id',
        ];
    }

    public function rules(): array
    {
        return [
            'filter.search' => "nullable|string",
            'sort.name' => "nullable|in:" . implode(",", array_keys($this->sort()))
        ];
    }


}
