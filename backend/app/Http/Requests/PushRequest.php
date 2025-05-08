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
            'keys.endpoint' => 'required',
            'keys.keys.auth' => 'required',
            'keys.keys.p256dh' => 'required',
        ];
    }
}
