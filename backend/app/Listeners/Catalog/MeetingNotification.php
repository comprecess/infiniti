<?php

namespace App\Listeners\Catalog;

use App\Events\Catalog\MeetingCreate;
use App\Models\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class MeetingNotification implements ShouldQueue
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
        $meeting = $event->getMeeting();
        $meeting->refresh();

//        if($meeting->responseFail()) {
//            return;
//        }

        $not = new Notification();
        $not->setUser($meeting->owner);
        $not->setModel($meeting);
        $not->date_active = $meeting->date;
        $not->save();

    }
}
