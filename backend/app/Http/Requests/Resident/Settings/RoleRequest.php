<?php

namespace App\Http\Requests\Resident\Settings;


use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Arr;
use Illuminate\Validation\ValidationException;


class RoleRequest extends FormRequest implements ConvertingPropertiesInterface
{
    use ConvertingPropertiesTrait;

    const TYPE_ACCESS = ['view','edit','create','delete','all'];


    public function rules(): array
    {
        $rules = [
            'name' => 'required',
            'access' => 'array',
            'access.*.permissionId' => 'required|exists:sys_permissions,id',
        ];

        foreach (self::TYPE_ACCESS as $value) {
            $rules['access.*.' . $value] = 'required|boolean';
        }

        return $rules;
    }


    public function getListProperties(): array
    {
        return [
            'name' => 'rname',
        ];
    }

    public function getPermission($id)
    {
        $data = Arr::where($this->access ?? [], function($value) use($id){
            return $value['permissionId'] == $id;
        });

        return Arr::first($data);
    }
}
