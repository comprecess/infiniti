<?php

namespace App\Http\Requests\Resident\Talents;

use Illuminate\Foundation\Http\FormRequest;


class BlockExperienceRequest extends FormRequest
{

    public function rules(): array
    {


        $data =  [
            'name' => "required",
            'position' => "required",
            'periodFrom' => "required|date|date_format:Y-m-d",
            'periodTo' => "nullable|date|date_format:Y-m-d|after:from",
            'responsibilities' => "nullable",
        ];

        return $data;
    }

}
