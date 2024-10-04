<?php

namespace App\Http\Requests\Resident\Invoices;


use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use App\Models\Resident\Invoices\Invoice;
use App\Models\Resident\Invoices\Offer;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;


class InvoiceUpdateRequest extends FormRequest implements ConvertingPropertiesInterface
{
    use ConvertingPropertiesTrait;


    public function rules(): array
    {
        return [
            'status' => [
                "nullable",
                Rule::in(Invoice::STATUS)
            ]
        ];
    }


    public function getListProperties(): array
    {
        return [
            'status',
        ];
    }
}
