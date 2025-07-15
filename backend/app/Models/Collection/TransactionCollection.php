<?php


namespace App\Models\Collection;


use App\Models\Resident\Transactions\Transaction;
use Illuminate\Database\Eloquent\Collection;

class TransactionCollection extends Collection
{
    //cr - прибыль
    //dr - расход

    public function profit()
    {
        return $this->sum(function($item){
            return $item->transformPrice('cr');
        });
    }

    public function expense()
    {
        return $this->sum(function($item){
            return $item->transformPrice('dr');
        });
    }

    public function amount($transformCurrency = false)
    {
        return $this->sum(function($item) use($transformCurrency){
            return $transformCurrency ? $item->transformPrice('amount') : $item->amount;
        });
    }

    public function amountByType(array $types = [], $transformCurrency = false)
    {
        return $this->sum(function ($item) use($types, $transformCurrency){
            if(in_array($item->type, $types)) {
                return $transformCurrency ? $item->transformPrice('amount') : $item->amount;
            }
            return 0;
        });
    }

    public function getNetWorth()
    {
        return $this->amountByType([Transaction::TYPE[4], Transaction::TYPE[0]], true) - $this->amountByType([Transaction::TYPE[1]], true);
    }

}
