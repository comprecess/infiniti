<?php

namespace App\Models;

use App\Models\Traits\FileStorageTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Config extends Model
{
    use HasFactory, FileStorageTrait;

    public $table = 'sys_appconfig';

    public $timestamps = false;

    public static function getSettings($name)
    {
        return self::where('setting', $name)->first();
    }

    public static function get($name, $default = null)
    {
        $cacheName = "config.{$name}";
        return Cache::remember($cacheName, config('cache.time.1week'), function() use($name, $default) {
            $settings = self::getSettings($name);
            if ($settings === null) {
                return $default;
            }

            return $settings->value;
        });
    }

    public static function set($name, $value)
    {
        $cacheName = "config.{$name}";
        $settings = self::getSettings($name);
        if(!$settings) {
            throw new \Exception("Config name '{$name}' not found");
        }

        $settings->value = $value;
        $settings->save();

        Cache::forget($cacheName);
    }
}
