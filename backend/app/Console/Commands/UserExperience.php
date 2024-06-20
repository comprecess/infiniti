<?php

namespace App\Console\Commands;

use App\Models\Catalog\User;
use Illuminate\Console\Command;

class UserExperience extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:user-experience';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Calculates user experience';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $users = User::all();
        foreach($users as $user) {
            $user->setExpirence();
        }

    }
}
