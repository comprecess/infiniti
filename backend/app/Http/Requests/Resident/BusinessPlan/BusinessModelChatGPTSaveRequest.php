<?php

namespace App\Http\Requests\Resident\BusinessPlan;

use Illuminate\Foundation\Http\FormRequest;

class BusinessModelChatGPTSaveRequest extends FormRequest
{

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */

    public function rules(): array
    {
        return [
            'response' => 'required',
        ];
    }
}
