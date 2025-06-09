<?php

namespace App\Http\Requests\Resident\Project\View;


use App\Http\Requests\Resident\DocumentRequest;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use App\Http\Requests\Traits\ModelTrait;

class FilesListRequest extends DocumentRequest
{
    use ConvertingPropertiesTrait, ModelTrait;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */

    public function rules(): array
    {
        return [];
    }

    public function sort(): array
    {
        return [
            'id' => 'sys_documents.id',
            'title' => 'sys_documents.title'
        ];
    }

    public function search(): array
    {
        return [
            'sys_documents.title',
            'sys_documents.file_mime_type',
            'sys_documents.created_at'
        ];
    }

}
