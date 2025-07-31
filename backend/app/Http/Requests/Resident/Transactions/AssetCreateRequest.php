<?php

namespace App\Http\Requests\Resident\Transactions;

use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Http\Requests\Interfaces\ModelInterface;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use App\Http\Requests\Traits\ModelTrait;
use App\Models\Resident\Transactions\AssetCategory;
use Illuminate\Foundation\Http\FormRequest;

class AssetCreateRequest extends FormRequest implements ConvertingPropertiesInterface, ModelInterface
{
    use ConvertingPropertiesTrait, ModelTrait;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */

    public function rules(): array
    {

        $rules = [
            'name' => 'required',
            'datePurchased' => 'nullable|date_format:Y-m-d',
            'supportedUntil' => 'nullable|date_format:Y-m-d',
            'price' => 'nullable|numeric|min:0',
            'serial' => 'nullable',
            'notes' => 'nullable',

        ];

        $this->setRule($rules)
            ->applyModel('category');

        return $rules;
    }


    public function getListProperties(): array
    {
        return [
            'name',
            'datePurchased' => 'date_purchased',
            'supportedUntil' => 'supported_until',
            'price',
            'serial',
            'notes',
            'category' => 'category_id'
        ];
    }

    public function getListPropertiesModel(): array
    {
        return [
            'category' => AssetCategory::class,
        ];
    }
}
