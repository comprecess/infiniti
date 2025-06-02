<?php

namespace App\Models\Resident\Transactions;

use App\Models\Traits\CurrencyTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccountBalances extends Model
{
    use HasFactory, CurrencyTrait;

    protected $table = "account_balances";

    protected $currencyId = 'currency_id';


}
