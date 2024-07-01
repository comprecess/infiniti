<?php


namespace App\Models\Traits;


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
}
