<?php

namespace App\Http\Requests\Resident\Transactions;

use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;


class AssetCategoryCreateRequest extends FormRequest implements ConvertingPropertiesInterface
{

    use ConvertingPropertiesTrait;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */

    public function rules(): array
    {

        $rules = [
            'name' => 'required'
        ];

        if($this->parent) {
            $rules['parent'] = [
                'integer',
                Rule::exists('asset_categories', 'id')
            ];
        }

        return $rules;
    }

    public function getListProperties(): array
    {
        return [
            'name',
        ];
    }
}
