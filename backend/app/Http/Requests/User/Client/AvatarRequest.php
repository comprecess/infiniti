<?php

namespace App\Http\Requests\User\Client;

use Illuminate\Foundation\Http\FormRequest;

class AvatarRequest extends FormRequest
{

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'file' => 'required|mimes:jpeg,jpg,png'
        ];
    }
}
