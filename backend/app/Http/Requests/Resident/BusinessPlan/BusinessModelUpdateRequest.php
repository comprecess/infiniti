<?php

namespace App\Http\Requests\Resident\BusinessPlan;

use Illuminate\Foundation\Http\FormRequest;


class BusinessModelUpdateRequest extends FormRequest
{

    public function rules(): array
    {
        return  [
            'preview' => 'nullable|image',
            'content' => 'nullable|image',
        ];
    }

}
