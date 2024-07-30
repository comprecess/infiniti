<?php

namespace App\Http\Requests\Resident\Client;

use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ClientViewRequest extends FormRequest
{

    const TYPE = [
        "summary",
        "activity",
        "invoices",
        "quotes",
        "files",
        "transactions",
        "email",
        "email",
        "log",
        "client-password-manager",
        "credit_card_info",
        "edit",
        "more",
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
