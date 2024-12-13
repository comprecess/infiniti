<?php


namespace App\Models\Traits;


use App\Models\Resident\Settings\Currency;
use Illuminate\Support\Number;
use NumberFormatter;

trait CurrencyTrait
{
    private $rateSum = null;

    public function getCurrency($column)
    {
//        Number::ensureIntlExtensionIsInstalled();
        $format = new NumberFormatter('en', 1);

        return $format->formatCurrency(is_string($column) ? $this->{$column} : $column, 'EUR') . " €";
    }

    public function getCurrencyId()
    {
        return $this->currencyId ?? false;
    }

    public function getCurrencyColumnName()
    {
        return $this->currencyColumnName ?? 'currency_iso_code';
    }

    public function getCurrencyIso()
    {
        if($this->getCurrencyId()) {
            return $this->belongsTo(Currency::class, $this->getCurrencyId() === true ? 'currency' : $this->getCurrencyId())->withTrashed();
        } else {
            return $this->belongsTo(Currency::class, $this->getCurrencyColumnName(), 'iso_code')->withTrashed();
        }
    }

    public function getCurrencyOrCreate()
    {
        if($this->getCurrencyId()) {
            $column = $this->getCurrencyId() === true ? 'currency' : $this->getCurrencyId();
            return Currency::where('id', $this->{$column})->withTrashed()->first();
        } else {
            return Currency::getAndCreate($this->{$this->getCurrencyColumnName()});
        }
    }
/*
    public function getCurrencyDel()
    {
        if($this->getCurrencyId()) {
            return $this->belongsTo(Currency::class, $this->getCurrencyId() === true ? 'currency' : $this->getCurrencyId())->withTrashed();
        } else {
            return $this->belongsTo(Currency::class, $this->getCurrencyColumnName(), 'iso_code')->withTrashed();
        }
    }
*/
    public function getColumn()
    {
        if($this->getCurrencyId()) {
            return $this->getCurrencyId() === true ? 'currency' : $this->getCurrencyId();
        }
        return $this->getCurrencyColumnName();
    }

    public function setCurrency(?Currency $currency = null)
    {
        $this->{$this->getColumn()} = $currency?->iso_code ?? Currency::getDefault()->iso_code;
        return $this;
    }

    public function printPrice($column, ?Currency $currencyTransform = null, $r = " ")
    {
        $currency = $currencyTransform ?? $this->getCurrencyIso ?? Currency::getDefault();
        $info = $currency?->getInfo();
        $price = is_string($column) ? $this->{$column} : $column;
        if($info) {
            $format = number_format($price, 2, $info['decimal_mark'], $info['thousands_separator']);
            return $info['symbol_first'] ? $info['symbol'] . $r .$format : $format . $r . $info['symbol'];
        }

        return $price;
    }

    private function getRate(?Currency $currencyTransform = null)
    {
        if($this->rateSum === null) {
            $def = $currencyTransform ?? Currency::getDefault();
            if(!$def) {
                throw new \Exception("Currency not set");
            }
            $currency = $this->getCurrencyIso;
            $this->rateSum = 1;
            if($currency && $def->iso_code != $currency->iso_code) {
                $this->rateSum = $def->rate / $currency->rate;
            }
        }

        return $this->rateSum;
    }

    public function transformPrice(string $nameColumn, ?Currency $currencyTransform = null, $print = false)
    {
        $price = (float) $this->{$nameColumn};
        $price = round($price * $this->getRate($currencyTransform), 2);
        return $print ? $this->printPrice($price, $currencyTransform ?? Currency::getDefault()) : $price;

    }

    /*
     private function getRate()
    {
        if($this->rateSum === null) {
            $def = Currency::getDefault();
            $currency = $this->getCurrencyIso;
            $this->rateSum = 1;
            if($currency && $def->iso_code != $currency->iso_code) {
//                dd($currency->rate);
                $this->rateSum = $def->rate / $currency->rate;
            }
        }
        dd($this->rateSum, $def->rate, $currency->rate);

        return $this->rateSum;
    }

    public function transformPrice(string $nameColumn, $print = false)
    {
        $price = (float) $this->{$nameColumn};
        $price = round($price * $this->getRate(), 2);
        return $print ? $this->printPrice($price) : $price;

    }
     */
}
