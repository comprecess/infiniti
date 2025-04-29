<?php

namespace App\Http\Requests\Resident\Transactions;


use App\Models\Resident\Transactions\Transaction;
use Illuminate\Foundation\Http\FormRequest;

class TransactionsTypeRequest extends FormRequest
{

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */

    public function rules(): array
    {
        return [
            'type' => 'nullable|in:' . implode(',', [Transaction::TYPE[0], Transaction::TYPE[1], Transaction::TYPE[2]])
        ];
    }

    public function getType()
    {
        return $this->type ?? Transaction::TYPE[0];
    }
}
