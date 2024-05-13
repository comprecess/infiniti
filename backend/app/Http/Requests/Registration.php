<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class Registration extends FormRequest
{

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'fullname' => 'required',
            'email' => 'required|email|unique:App\Models\Users\Client,email',
            'password' => 'min:6|required|required_with:password2|same:password2',
            'password2' => 'min:6|required|required_with:password2|same:password2'
        ];
    }
}
