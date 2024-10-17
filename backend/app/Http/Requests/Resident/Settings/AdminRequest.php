<?php

namespace App\Http\Requests\Resident\Settings;


use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;


class AdminRequest extends FormRequest implements ConvertingPropertiesInterface
{
    use ConvertingPropertiesTrait;


    public function rules(): array
    {
        $rules = [
            'clientId' => "required|exists:crm_accounts,id",
            'status' => "required|in:" . implode(",", $status),
            'dueDate' => "nullable|in:" . implode(",", array_keys(self::DUEDATE)),
            'currency' => "required|exists:sys_currencies,iso_code",
            'date' => 'required|date_format:Y-m-d',
        ];

        $invoice = $this->route('invoice');

        if($invoice) {
            unset($rules['status']);
            if($invoice->blockEdit()) {
                throw throw ValidationException::withMessages(["invoice.status" => __('resident.invoice.blockStatus')]);
            }
        }

        return $rules;
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
            'checkPublic' => 'check_public'
        ];
    }
}
