<?php

namespace App\Http\Requests\Resident\Talents;

use Illuminate\Foundation\Http\FormRequest;


class BlockExperienceTalentRequest extends FormRequest
{

    public function getBlock($name = null)
    {
        return $name === null ? $this->blockExperience : ($name === false ? "blockExperience" : "blockExperience.*.{$name}");
    }

    public function rules(): array
    {

        $data =  [
            $this->getBlock(false) => "nullable|array",
            $this->getBlock('id') => "nullable|integer",
            $this->getBlock('name') => "required",
            $this->getBlock('position') => "required",
            $this->getBlock('periodFrom') => "required|date|date_format:Y-m-d",
            $this->getBlock('periodTo') => "nullable|date|date_format:Y-m-d|after:from",
            $this->getBlock('responsibilities') => "nullable",
        ];

        return $data;
    }

}
