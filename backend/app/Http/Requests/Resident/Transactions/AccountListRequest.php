<?php

namespace App\Http\Requests\Resident\Transactions;

use App\Http\Requests\Resident\DocumentRequest;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;

class AccountListRequest extends DocumentRequest
{
    use ConvertingPropertiesTrait;

    public function isDocument()
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */

    public function sort() :array
    {
        return [
            'id' => 'sys_accounts.id',
            'name' => 'sys_accounts.account',
            'balance' => 'sys_accounts.balance',
        ];
    }

    public function search(): array
    {
        return [
            'id',
            'sys_accounts.account',
            'sys_accounts.description',
            'sys_accounts.account_number',
            'sys_accounts.contact_person',
            'sys_accounts.contact_phone',
            'sys_accounts.ib_url',
        ];
    }

}
