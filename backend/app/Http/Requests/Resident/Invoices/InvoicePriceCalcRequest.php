<?php

namespace App\Http\Requests\Resident\Invoices;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;


class InvoicePriceCalcRequest extends FormRequest
{
    const TYPE = [
        'calc' => null,
        'test' => 'test'
    ];

    public function getPriceList($name = null)
    {
        return $name === null ? $this->blankList : ($name === false ? "blankList" : "blankList.*.{$name}");
    }

    public function rules(): array
    {
        Log::alert('InvoicePriceCalcRequest', $this->all());

        $type = array_keys(self::TYPE);
        unset($type[0]);
        collect($this->getPriceList() ?? [])->each(function($data, $key) use($type){
            if(in_array($data['type'], $type)) {
                if(Arr::get($data, 'id') == null) {
                    throw ValidationException::withMessages(["id" => __('validation.required_if', ['attribute' => "data.{$key}.id", "other" => 'type', 'value' => $data['type']])]);
                }
            }
        });

        $data =  [
            $this->getPriceList(false) => "required|array",
            $this->getPriceList('type') => "required|in:". implode(",", array_keys(self::TYPE)),
            $this->getPriceList('id') => "nullable|integer",
            $this->getPriceList('amount') => "nullable|integer",
            $this->getPriceList('price') => "nullable|numeric",
            $this->getPriceList('discount') => "nullable|numeric",
            $this->getPriceList('discountType') => "nullable|in:percent,fixed",
            $this->getPriceList('tax') => "nullable|exists:sys_tax,id",
            $this->getPriceList('description') => "nullable",
            "currency" => "nullable|exists:sys_currencies,iso_code"
        ];

        return $data;
    }

    public function discount($price, $type, $value)
    {
        if(!$value) {
            return 0;
        }

        if($type == 'percent') {
            $value = $value < 0 ? 0 : ($value > 100 ? 100 : $value) ;
            $value *= 0.01;
            $value = $price * $value;
        }

        return $value;

    }

}
