<?php

namespace App\Http\Requests\Resident\Invoices;


use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use App\Models\Resident\Invoices\Invoice;
use Illuminate\Foundation\Http\FormRequest;


class InvoiceRequest extends FormRequest implements ConvertingPropertiesInterface
{
    use ConvertingPropertiesTrait;


    const STATUS = [
        'Published' => 'Unpaid',
        'Draft' => 'Draft',
    ];

    const DUEDATE = [
        3, 5, 7, 10, 15, 30, 45, 60
    ];


    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */

    public function rules(): array
    {
        return [
            'filter.status' => "nullable|in:". implode(",", Invoice::STATUS),
            'filter.search' => "nullable|string",
            'sort.name' => "nullable|in:" . implode(",", array_keys(self::SORT)),
            'document' => "nullable|in:" . implode(",", self::DOCUMENT),
        ];
    }


    public function getListProperties(): array
    {
        // TODO: Implement getListProperties() method.
    }
}
