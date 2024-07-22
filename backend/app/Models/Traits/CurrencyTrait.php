<?php


namespace App\Models\Traits;


use App\Models\Resident\Settings\Currency;
use Illuminate\Support\Number;
use NumberFormatter;

trait CurrencyTrait
{

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
            return $this->belongsTo(Currency::class, $this->getCurrencyId() === true ? 'currency' : $this->getCurrencyId());
        } else {
            return $this->belongsTo(Currency::class, $this->getCurrencyColumnName(), 'iso_code');
        }
    }

    public function printPrice($column, $r = " ")
    {
        $currency = $this->getCurrencyIso;
        $info = $currency?->getInfo();
        if($info) {
            $format = number_format($this->{$column}, 2, $info['decimal_mark'], $info['thousands_separator']);
            return $info['symbol_first'] ? $info['symbol'] . $r .$format : $format . $r . $info['symbol'];
        }

        return $this->{$column};
    }
}
