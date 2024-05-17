<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Config extends Model
{
    use HasFactory;

    public $table = 'sys_appconfig';

    public static function get($name, $default = null)
    {
        $setting = self::where('setting', $name)->first();
        if($setting === null) {
            return $default;
        }

        return $setting->value;
    }
}
