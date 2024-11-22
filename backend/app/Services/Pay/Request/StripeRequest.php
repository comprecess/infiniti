<?php

namespace App\Services\Pay\Request;

use Illuminate\Foundation\Http\FormRequest;

class StripeRequest extends FormRequest
{

    public function rules(): array
    {
        \Illuminate\Support\Facades\Log::alert('***StripeRequest***', $this->all());
        return [
            'token' => 'required'
        ];
    }
}
