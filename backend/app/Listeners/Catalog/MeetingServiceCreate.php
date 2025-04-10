<?php

namespace App\Listeners\Catalog;

use App\Contracts\MeetingContract;
use App\Events\Catalog\MeetingCreate;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class MeetingServiceCreate implements ShouldQueue
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
    public function handle(MeetingCreate $event): void
    {
        $service = app(MeetingContract::class);
        $service->create($event->getMeeting());
    }
}
