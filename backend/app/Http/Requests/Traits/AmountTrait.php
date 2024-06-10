<?php


namespace App\Http\Requests\Traits;


trait AmountTrait
{
    public function getAmount()
    {
        $amount = (int) $this->amount;
        return $amount ? $amount : 20;
    }
}
