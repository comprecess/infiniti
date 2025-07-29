<?php

namespace App\Http\Requests\Catalog;

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
            'catalogUser' => 'required|integer|exists:catalog_user,id',
            'amount' => 'nullable|integer|min:1',
            'type' => 'nullable|in:'. implode(',', Cart::TYPE)
        ];
    }
}
