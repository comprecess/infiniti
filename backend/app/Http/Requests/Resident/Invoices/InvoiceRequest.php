<?php

namespace App\Http\Requests\Resident\Invoices;


use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Http\Requests\Interfaces\ModelInterface;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use App\Http\Requests\Traits\ModelTrait;
use App\Models\Resident\Project\Project;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;


class InvoiceRequest extends FormRequest implements ConvertingPropertiesInterface, ModelInterface
{
    use ConvertingPropertiesTrait, ModelTrait;


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
        $status = array_keys(self::STATUS);
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
                throw ValidationException::withMessages(["invoice.status" => __('resident.invoice.blockStatus')]);
            }
        }

        $this->setRule($rules)
            ->applyModel('project');

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
            'checkPublic' => 'check_public',
        ];
    }

    public function getListPropertiesModel(): array
    {
        return [
            'project' => Project::class
        ];
    }
}
