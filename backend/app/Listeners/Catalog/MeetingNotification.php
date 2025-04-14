<?php

namespace App\Listeners\Catalog;

use App\Events\Catalog\MeetingCreate;
use App\Models\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class MeetingNotification
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
        $model = $event->getMeeting();

        $not = new Notification();
        $not->setUser($model->owner);
        $not->setModel($model);
        $not->date_active = $model->date;
        $not->save();

    }
}
