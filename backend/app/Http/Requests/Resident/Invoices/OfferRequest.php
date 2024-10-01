<?php

namespace App\Http\Requests\Resident\Invoices;


use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use App\Models\Resident\Invoices\Offer;
use Illuminate\Foundation\Http\FormRequest;


class OfferRequest extends FormRequest implements ConvertingPropertiesInterface
{
    use ConvertingPropertiesTrait;


    public function rules(): array
    {

        $rules = [
            'clientId' => "required|exists:crm_accounts,id",
            'subject' => "required",
            'stage' => "required|in:" . implode(",", Offer::STAGE),
            'dateCreated' => 'required|date_format:Y-m-d',
            'validUntil' => 'nullable|date_format:Y-m-d',
        ];

        return $rules;
    }


    public function getListProperties(): array
    {
        return [
            'clientId' => 'userid',
            'subject',
            'stage',
            'validUntil' => 'validuntil',
            'dateCreated' => 'datecreated',
            'offerNum' => 'invoicenum',
            'num' => 'cn',
            'proposal',
            'notes' => 'customernotes',
        ];
    }
}
