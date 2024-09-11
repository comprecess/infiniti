<?php

namespace App\Http\Requests\Resident\Invoices;


use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use App\Models\Resident\Invoices\Invoice;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;


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
        #test
        Log::alert('Invoice::createOrUpdate', $this->all());
        #test

        return [
            'clientId' => "required|exists:crm_accounts,id",
            'status' => "required|in:" . implode(",", array_keys(self::STATUS)),
            'dueDate' => "nullable|in:" . implode(",", array_keys(self::DUEDATE)),
            'currency' => "required|exists:sys_currencies,iso_code",
            'date' => 'required|date_format:Y-m-d',
        ];
    }


    public function getListProperties(): array
    {
        return [
            'clientId' => 'userid',
            'currency' => 'currency_iso_code',
            'title',
            'invoiceNum' => 'invoicenum',
            'num' => 'cn',
            'receiptNumber' => 'receipt_number',
            'showQuantity' => 'show_quantity_as',
            'notes'
        ];
    }
}
