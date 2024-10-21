<?php

namespace App\Http\Requests\Resident;


use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use Illuminate\Foundation\Http\FormRequest;

class DocumentFileCreateRequest extends FormRequest implements ConvertingPropertiesInterface
{

    use ConvertingPropertiesTrait;

    public function rules(): array
    {
        return [
            'title' => "required|string",
            'file' => "required|file",
            'global' => "boolean",
        ];
    }

    public function getListProperties(): array
    {
        return [
            'title',
            'global' => 'is_global'
        ];
    }
}
