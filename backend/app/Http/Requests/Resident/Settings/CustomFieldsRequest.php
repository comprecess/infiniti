<?php

namespace App\Http\Requests\Resident\Settings;

use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use App\Models\Catalog\Cart;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CustomFieldsRequest extends FormRequest implements ConvertingPropertiesInterface
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
            "type" => "required"
        ];
    }


    public function getListProperties(): array
    {
        [
            "name" => "fieldname",
            "type" => "fieldtype",
            "description",
            "fieldOptions" => "fieldoptions",
            "regexpr",
            "showInvoice" => "showinvoice",
        ];
    }
}
