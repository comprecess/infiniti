<?php

namespace App\Listeners\Client\BusinessPlan;

use App\Events\Client\BusinessPlan\Generate;
use App\Models\Resident\BusinessPlan;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class CreateTeams implements ShouldQueue
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(Generate $event): void
    {

        for($i = 0; $i < 5; $i++) {
            sleep(1);
        }

        Log::alert('***CreateTeams*** complete');
        $event->businessPlan->status_generate = BusinessPlan::STATUS_GENERATE[2];
        $event->businessPlan->save();
    }
}
