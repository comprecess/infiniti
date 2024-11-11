<?php

namespace App\Http\Requests\Resident;


use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use App\Models\FileStorage;
use Illuminate\Foundation\Http\FormRequest;

class DocumentFileCreateRequest extends FormRequest implements ConvertingPropertiesInterface
{

    use ConvertingPropertiesTrait;

    public function rules(): array
    {
        return [
            'title' => "required|string",
            'file' => "required|file|extensions:". implode(',', array_keys(FileStorage::FILE_TYPE)),
            'global' => "required|boolean",
        ];
    }

    public function getListProperties(): array
    {
        return [
            'title',
            'global' => 'is_global'
        ];
    }
    public function messages()
    {
        return [
          'file.extensions' => 'Invalid file format'
        ];
    }
}
