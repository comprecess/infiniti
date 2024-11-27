<?php

namespace App\Models\Resident\Settings;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;

class Currency extends Model
{
    use HasFactory, SoftDeletes;

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
            return self::where('isdefault', 1)->first();
        });
    }
}
