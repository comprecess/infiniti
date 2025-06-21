<?php

namespace App\Console;

use App\Console\Commands\Catalog\MeetingReminder;
use App\Console\Commands\SetCurrency;
use App\Console\Commands\Talents\NewTalent;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // $schedule->command('inspire')->hourly();
        $schedule->command(SetCurrency::class)->daily();
        $schedule->command(MeetingReminder::class)->hourly();
        $schedule->command(NewTalent::class)->weeklyOn(5, '3:00');
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
