<?php

namespace App\Http\Requests\Resident\Talents;

use Illuminate\Foundation\Http\FormRequest;


class TalentUpdateRequest extends FormRequest
{

    public function rules(): array
    {
        return  [
            'file' => 'nullable|image',
        ];
    }

}
