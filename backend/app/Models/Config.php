<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Config extends Model
{
    use HasFactory;

    public $table = 'sys_appconfig';

    public $timestamps = false;

    public static function getSettings($name)
    {
        return self::where('setting', $name)->first();
    }

    public static function get($name, $default = null)
    {
        $settings = self::getSettings($name);
        if($settings === null) {
            return $default;
        }

        return $settings->value;
    }

    public static function set($name, $value)
    {
        $settings = self::getSettings($name);
        if(!$settings) {
            throw new \Exception("Config name '{$name}' not found");
        }

        $settings->value = $value;
        $settings->save();
    }
}
