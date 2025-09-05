<?php

namespace App\Models\Resident\Settings;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;

class CurrencyHistory extends Model
{
    use HasFactory;

    protected $table = 'sys_currency_history';

    public $timestamps = false;

    public function getInfo()
    {
        return Cache::remember('Currency.ISO.'. $this->iso_code, config('cache.time.1year'), function(){
            return Arr::get(config('data.currency'), $this->iso_code, null);
        });

    }

}
