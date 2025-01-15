<?php


namespace App\Services;


use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;
use function PHPUnit\Framework\isNull;

class RedisCache
{
    private $on_redis = false;
    private $redis = null;

    public function __construct()
    {
        $this->on_redis = config('cache.on_redis');
        if($this->on_redis) {
            $this->redis = Redis::connection('cache');
        }
    }

    public function remember($key, callable $function, $time = null)
    {
        $time = $time ?? config('cache.time.1month');


        $data = $this->redis?->get($key) ?? Cache::get($key);
        if(!isNull($data)) {
            return unserialize($data);
        }

        $data = $function();

        if($this->redis) {
            $this->redis->set($key, serialize($data), null, $time);
        } else {
            Cache::set($key, serialize($data), $time);
        }

        return $data;
    }
}
