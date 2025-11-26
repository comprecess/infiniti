<?php

namespace App\Http\Requests\Resident\BusinessPlan;


use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BusinessPlanUpdateRequest extends FormRequest
{

    public function rules(): array
    {
        return [
            'teams' => 'nullable|array',
            'teams.*' => [
                'required',
                'integer',
                Rule::exists('catalog_user', 'id')->where('active', 1)
            ]
        ];
    }

}
