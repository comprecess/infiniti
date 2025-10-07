<?php

namespace App\Http\Requests\Client\Document;


use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use App\Models\FileStorage;
use App\Models\Resident\Document;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Arr;

class DocumentFileCreateRequest extends FormRequest
{

    public function rules(): array
    {
        $rules = [
            'title' => "required|string",
            'file' => "required|file|extensions:". implode(',', array_keys(FileStorage::FILE_TYPE)),
        ];


        return $rules;
    }
}
