<?php

namespace App\Http\Requests\Public\Petition;

use App\Services\Pay\Pay;
use Illuminate\Foundation\Http\FormRequest;

class PayRequest extends FormRequest
{

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $this->merge(['type' => $this->route('type'), 'payType' => $this->route('payType')]);

        return [
            'type' => 'required|in:invoice',
            'payType' => 'required|in:' . implode(',', array_keys(Pay::PAY_LIST))
        ];
    }
}
