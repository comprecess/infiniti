<?php

namespace App\Services\Pay\Request;

use Illuminate\Foundation\Http\FormRequest;

class ManualPaymentRequest extends FormRequest
{

    public function rules(): array
    {

        return [
            'file' => 'required',
            'title' => 'required'
        ];
    }
}
