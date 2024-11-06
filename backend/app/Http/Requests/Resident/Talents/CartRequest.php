<?php

namespace App\Http\Requests\Resident\Talents;

use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use App\Models\Catalog\Cart;
use Illuminate\Foundation\Http\FormRequest;

class CartRequest extends FormRequest implements ConvertingPropertiesInterface
{
    use ConvertingPropertiesTrait;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {

        return [
            'amount' => 'nullable|integer',
            'type' => 'nullable|in:'. implode(',', Cart::TYPE)
        ];
    }

    public function getListProperties(): array
    {
        return [
            'amount',
            'type' => 'name_id_type',
        ];
    }
}
