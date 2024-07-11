<?php

namespace App\Http\Requests\Resident\Client;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class GroupSortRequest extends FormRequest
{


    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'groups' => 'required|array',
            'groups.*' => 'required|integer|exists:crm_groups,id',
        ];
    }
}
