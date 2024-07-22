<?php

namespace App\Http\Requests\Resident\Client;

use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CompanyViewRequest extends FormRequest
{

    const TYPE = [
        "summary",
        "memo",
        "customers",
        "invoices",
        "quotes",
        "orders",
        "transactions"
    ];

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $this->merge(['type' => $this->route('type')]);
        return [
            'type' => "in:" . implode(",", self::TYPE),
        ];
    }


}
