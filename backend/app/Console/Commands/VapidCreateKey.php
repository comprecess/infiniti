<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Minishlink\WebPush\VAPID;

class VapidCreateKey extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:vapid-create-key';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'create key VAPID';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $keys = VAPID::createVapidKeys();
        dd($keys);
    }
}
