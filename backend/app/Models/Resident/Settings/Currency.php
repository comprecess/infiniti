<?php

namespace App\Models\Resident\Settings;

use App\Console\Commands\SetCurrency;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;

class Currency extends Model
{
    use HasFactory, SoftDeletes;

    const BASE = "USD";

    protected $table = 'sys_currencies';

    public function getInfo()
    {
        return Cache::remember('Currency.ISO.'. $this->iso_code, config('cache.time.1year'), function(){
            return Arr::get(config('data.currency'), $this->iso_code, null);
        });

    }

    public function printPrice($value, $r = " ")
    {
        $info = $this->getInfo();
        if($info) {
            $format = number_format($value, 2, $info['decimal_mark'], $info['thousands_separator']);
            return $info['symbol_first'] ? $info['symbol'] . $r .$format : $format . $r . $info['symbol'];
        }

        return $value;
    }

    public static function getForSelect()
    {
        return self::orderBy('iso_code')->get();
    }

    public static function getDefault()
    {
        return Cache::remember('Currency.Default', config('cache.time.1month'), function(){
            return self::withTrashed()->where('isdefault', 1)->first();
        });
    }

    public static function getAndCreate(string $isoCode, bool $hard = false)
    {
        $isoCode = strtoupper($isoCode);
        $currency = self::where('iso_code', $isoCode)->withTrashed()->first();
        if($currency) {
            return $currency;
        }

        $info = Arr::get(config('data.currency'), $isoCode, null);

        if(!$info && $hard) {
            throw new \Exception("Currency iso:{$isoCode} not exists");
        }

        if($info) {
            $currency = new self();
            $currency->cname = $isoCode;
            $currency->iso_code = $isoCode;
            $currency->deleted_at = now();
            $currency->save();

            Artisan::command(SetCurrency::class);

            return $currency;
        }

        return $isoCode;
    }

    private function getRateNow(Currency $currency)
    {
        return $this->iso_code != $currency->iso_code ?  $currency->rate / $this->rate : 1;
    }

    public function transform(int|float $price, Currency $currency)
    {
        return round($price * $this->getRateNow($currency), 2);
    }

}
