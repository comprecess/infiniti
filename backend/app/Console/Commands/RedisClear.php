<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;

class RedisClear extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:redis-clear';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $prefixs = ['image:scale:'];
//        $prefix = 'image:scale:';
        $redisDrive = Redis::connection('cache');

        foreach($prefixs as $prefix){
            $keys = $redisDrive->keys("{$prefix}*");
            dump("prefix: \"{$prefix}\"; count: " . count($keys));
            foreach($keys as $key) {
                $serch = strpos($key, $prefix);
                if($serch !== false) {
                    $key = substr($key, $serch);
                    dump($key);
                    $redisDrive->del($key);
                }

            }
        }
//        dd($redisDrive->keys("{$prefix}*"));

    }
}
