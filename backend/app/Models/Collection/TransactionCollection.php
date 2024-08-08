<?php


namespace App\Models\Collection;


use Illuminate\Database\Eloquent\Collection;

class TransactionCollection extends Collection
{
    //cr - прибыль
    //dr - расход

    public function profit()
    {
        return $this->sum(function($item){
            return $item->cr;
        });
    }

    public function expense()
    {
        return $this->sum(function($item){
            return $item->dr;
        });
    }

}
