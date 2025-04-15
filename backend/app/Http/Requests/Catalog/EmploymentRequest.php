<?php

namespace App\Http\Requests\Catalog;

use Illuminate\Foundation\Http\FormRequest;

class EmploymentRequest extends FormRequest
{

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {

        return [
            'timezone' => 'nullable|timezone:all',
            'ids' => 'nullable|array',
            'ids.*' => 'required|integer|exists:catalog_user,id'
        ];
    }
}
