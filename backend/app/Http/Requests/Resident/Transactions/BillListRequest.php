<?php

namespace App\Http\Requests\Resident\Transactions;

use App\Http\Requests\Resident\DocumentRequest;

class BillListRequest extends DocumentRequest
{

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */

    public function isDocument()
    {
        return false;
    }

    public function sort() :array
    {
        return [
            'id' => 'bills.id',
            'title' => 'bills.title',
            'amount' => 'bills.net_amount',
            'nextDate' => 'bills.next_date',
        ];
    }
}
