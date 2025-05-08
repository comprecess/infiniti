<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PushRequest extends FormRequest
{

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
//        $timezone = array_keys(config('data.timezone', []));
        return [
            'endpoint' => 'required',
            'keys.auth' => 'required',
            'keys.p256dh' => 'required',
        ];
    }
}
