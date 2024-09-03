<?php

namespace App\Models\Resident\Settings;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;

class Tax extends Model
{
    use HasFactory;

    protected $table = 'sys_tax';

    public static function getForSelect()
    {
        return self::orderBy('id')->get();
    }

    public function getTaxPrice($price)
    {
        return round($price * ($this->rate * 0.01), 2);
    }

}
