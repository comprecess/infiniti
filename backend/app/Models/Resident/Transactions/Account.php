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

    public function balances()
    {
        return $this->hasMany(AccountBalances::class, 'account_id');
    }

    public static function getBalance(?Currency $currency = null, $accountQuery = null, ?callable $callableQuery = null)
    {
        $accaunts = $accountQuery ?? Account::all();
        $balance = Transaction::getBalance($currency, $callableQuery);
        $accaunts->each(function($item) use($balance, $currency){
            $item->balance = $balance[$item->id] ?? null;
            $item->balance_currency = $currency;
        });

        return $accaunts;
    }

    public function transactionRemove(Transaction $transaction)
    {
        /** Тут возможно нужно делать перерасчет в валютах*/
        if($transaction->cr) {
            $this->balance -= $transaction->cr;
        } else {
            $this->balance += $transaction->dr;
        }

        $this->save();
        $currency = Currency::getDefault();

        $balance = $this->balances()->where('currency_id', $currency->id)->first();
        if($balance) {
            if($transaction->cr) {
                $balance->balance -= $transaction->cr;
            } else {
                $balance->balance += $transaction->dr;
            }
            $balance->save();
        }
    }

}
