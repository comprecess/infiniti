<?php


namespace App\Models\Collection;


use App\Models\MultipleConditions\InvoiceStatus;
use App\Models\Resident\Invoices\Invoice;
use Illuminate\Database\Eloquent\Collection;

class InvoiceItemCollection extends Collection
{
    public function summPrice()
    {
        return round($this->sum(function($item){
            return $item->getSumm();
        }),2);
    }

    public function summDiscount()
    {
        return round($this->sum(function($item){
            return $item->getDiscount();
        }), 2);
    }

    public function summTax()
    {
        return round($this->sum('taxamount'), 2);
    }

    public function summTotal()
    {
        return round($this->sum('total'), 2);
    }
}
