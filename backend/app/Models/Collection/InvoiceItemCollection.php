<?php


namespace App\Models\Collection;


use App\Models\MultipleConditions\InvoiceStatus;
use App\Models\Resident\Invoices\Invoice;
use App\Models\Resident\Settings\Currency;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class InvoiceItemCollection extends Collection
{
    public function summPrice(?Currency $currency = null)
    {
        return round($this->sum(function($item) use($currency){
            return $item->transformPrice((float) $item->getSumm(), $currency);
        }),2);
    }

    public function summDiscount(?Currency $currency = null)
    {
        return round($this->sum(function($item) use($currency){
            return $item->transformPrice((float) $item->getDiscount(), $currency);
        }), 2);
    }

    public function summTax(?Currency $currency = null)
    {
//        return round($this->sum('taxamount'), 2);
        return round($this->sum(function($item) use($currency){
            return $item->transformPrice('taxamount', $currency);
        }), 2);
    }

    public function summTotal(?Currency $currency = null)
    {
//        return round($this->sum('total'), 2);
        return round($this->sum(function($item) use($currency){
            return $item->transformPrice('total', $currency);
        }), 2);
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
