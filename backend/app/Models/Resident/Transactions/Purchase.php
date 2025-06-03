<?php

namespace App\Models\Resident\Transactions;

use App\Models\Traits\CurrencyTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    use HasFactory, CurrencyTrait;

    protected $table = "sys_purchases";

    protected $currencyId = 'currency_id';

    public function transactionRemove(Transaction $transaction)
    {
        /** Тут возможно нужно делать перерасчет в валютах*/
        if($transaction->purchase_id == $this->id) {
            $this->credit -= $transaction->amount;
            $this->save();
        }
    }
}
