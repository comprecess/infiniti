<?php

namespace App\Http\Requests\Resident\Invoices;


use App\Models\Resident\Invoices\InvoiceItem;
use Illuminate\Validation\Rule;


class InvoiceBlankRequest extends InvoicePriceCalcRequest
{

    public function rules(): array
    {

        $service = array_keys(InvoiceItem::SERVICE);
        $serviceModel = self::getService();
        $data =  [
            'service' => "required|in:". implode(",", $service),
            'serviceId' => [
                Rule::requiredIf(function () use($serviceModel){
                    return in_array($this->service, $serviceModel->keys()->all());
                })
                ],
            'amount' => "nullable|integer",
            'price' => "nullable|numeric",
            'discount' => "nullable|numeric",
            'discountType' => "nullable|in:percent,fixed",
            'tax' => "nullable|exists:sys_tax,id",
            'description' => "nullable",
            "currency" => "nullable|exists:sys_currencies,iso_code"
        ];

        if($serviceModel->get($this->service)) {
            $data['serviceId'][] = Rule::exists($serviceModel->get($this->service), 'id');
        }

        return $data;
    }


}
