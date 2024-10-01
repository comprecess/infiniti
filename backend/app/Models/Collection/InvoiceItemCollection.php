<?php


namespace App\Models\Collection;


use App\Models\MultipleConditions\InvoiceStatus;
use App\Models\Resident\Invoices\Invoice;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

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

    public function cloneItems(Model $model, callable $callable = null)
    {
        $this->each(function ($item) use($model, $callable){
            $item->replicate();
            $item->document_type = $model::class;
            $item->document_id = $model->id;

            if(is_callable($callable)) {
                $callable($item);
            }
        });
    }
}
