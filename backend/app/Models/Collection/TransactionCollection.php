<?php


namespace App\Models\Collection;


use App\Models\Resident\Settings\Currency;
use App\Models\Resident\Transactions\Transaction;
use Illuminate\Database\Eloquent\Collection;

class TransactionCollection extends Collection
{
    //cr - прибыль
    //dr - расход

    public function profit(?Currency $currency = null)
    {
        return round($this->sum(function($item) use($currency){
            return $item->transformPrice('cr', $currency);
        }), 2);
    }

    public function expense(?Currency $currency = null)
    {
        return round($this->sum(function($item) use($currency){
            return $item->transformPrice('dr', $currency);
        }), 2);
    }

    public function amount($transformCurrency = false)
    {
        return round($this->sum(function($item) use($transformCurrency){
            return $transformCurrency ? $item->transformPrice('amount') : $item->amount;
        }), 2);
    }

    public function amountByType(array $types = [], $transformCurrency = false)
    {
        return round($this->sum(function ($item) use($types, $transformCurrency){
            if(in_array($item->type, $types)) {
                return $transformCurrency ? $item->transformPrice('amount') : $item->amount;
            }
            return 0;
        }),2);
    }

    public function getNetWorth()
    {
        return $this->amountByType([Transaction::TYPE[4], Transaction::TYPE[0]], true) - $this->amountByType([Transaction::TYPE[1]], true);
    }

}
