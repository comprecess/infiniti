<?php


namespace App\Models\Collection;


use App\Models\MultipleConditions\InvoiceStatus;
use App\Models\Resident\Invoices\Invoice;
use Illuminate\Database\Eloquent\Collection;

class InvoiceCollection extends Collection
{
    protected $calc = [
        'invoice_amount','paid_amount','unpaid_amount', 'cancelled_amount', 'partially_paid_amount'
    ];

    protected $calcValue = [];


    private function calc()
    {
        $typesValue = array_fill(0, count($this->calc), 0.0);
        $this->calcValue = array_combine($this->calc, $typesValue);

        $collect = collect([]);
        $conditions = (new InvoiceStatus())->setMethods(Invoice::STATUS);
        $this->each(function($item) use($collect, $conditions){
            $this->calcValue['invoice_amount'] += $item->transformPrice('total');
            $collect->push($conditions->make($item, 'status'));
        });

        foreach($this->calc as $value) {
            $sum = $collect->sum($value);
            $this->calcValue[$value] = $sum ? $sum : $this->calcValue[$value];
        }
    }

    public function __get($key)
    {
        if(in_array($key, $this->calc)) {
            if(!isset($this->calcValue[$key])) {
                $this->calc();
            }
            return $this->calcValue[$key];
        }
        return parent::__get($key);
    }

}
