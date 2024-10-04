<?php

namespace App\Http\Requests\Resident\Invoices;


use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use App\Models\Resident\Invoices\Offer;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;


class OfferUpdateRequest extends FormRequest implements ConvertingPropertiesInterface
{
    use ConvertingPropertiesTrait;


    public function rules(): array
    {
        return [
            'stage' => [
                "nullable",
                Rule::in(Offer::STAGE)
            ]
        ];
    }


    public function getListProperties(): array
    {
        return [
            'stage',
        ];
    }
}
