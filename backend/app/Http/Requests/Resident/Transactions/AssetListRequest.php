<?php

namespace App\Http\Requests\Resident\Transactions;

use App\Http\Requests\Interfaces\ModelInterface;
use App\Http\Requests\Resident\DocumentRequest;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use App\Http\Requests\Traits\ModelTrait;
use App\Models\Resident\Transactions\AssetCategory;

class AssetListRequest extends DocumentRequest implements ModelInterface
{
    use ConvertingPropertiesTrait, ModelTrait;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */

    public function sort() :array
    {
        return [
            'id' => 'assets.id',
            'name' => 'assets.name',
            'datePurchased' => 'assets.date_purchased',
            'supportedUntil' => 'assets.supported_until',
            'price' => 'assets.price',
        ];
    }

    public function rules(): array
    {

        $rules = parent::rules();

        $this->setRule($rules)->applyModel('filter.category');

        return $rules;
    }

    public function getListPropertiesModel(): array
    {
        return [
            'filter.category' => AssetCategory::class,
        ];
    }
}
