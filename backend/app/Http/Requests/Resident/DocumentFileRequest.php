<?php

namespace App\Http\Requests\Resident;


class DocumentFileRequest extends DocumentRequest
{
    public function sort() :array
    {
        return [
            'id' => 'sys_documents.id',
            'title' => 'sys_documents.title'
        ];
    }

}
