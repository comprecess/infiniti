<?php

namespace App\Http\Requests\Resident\Talents;

use App\Models\Catalog\Cart;
use Illuminate\Foundation\Http\FormRequest;

class CartRequest extends FormRequest
{

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {

        return [
            'amount' => 'required|integer',
            'type' => 'required|in:'. implode(',', Cart::TYPE)
        ];
    }
}
