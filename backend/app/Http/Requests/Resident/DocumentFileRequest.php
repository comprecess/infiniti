<?php

namespace App\Http\Requests\Resident;


class DocumentFileRequest extends DocumentRequest
{
    public function sort() :array
    {
        return [
            'id' => 'id',
            'title' => 'title'
        ];
    }

}
