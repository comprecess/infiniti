<?php

namespace App\Models\Resident\Transactions;

use App\Models\Resident\Settings\Currency;
use App\Models\Traits\CurrencyTrait;
use App\Models\Traits\UserTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    use HasFactory, UserTrait, CurrencyTrait;

    protected $table = "sys_accounts";

    protected $adminColumn = 'owner_id';

    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'account_id');
    }

    public static function getBalance(?Currency $currency = null)
    {
        $accaunts = Account::all();
        $balance = Transaction::getBalance($currency);
        $accaunts->each(function($item) use($balance, $currency){
            $item->balance = $balance[$item->id] ?? null;
            $item->balance_currency = $currency;
        });

        return $accaunts;
    }

}
