<?php

namespace App\Listeners\Catalog\Meeting\Create;

use App\Events\Catalog\MeetingCreate;
use App\Models\Notification as NotificationModel;
use App\Services\Push\Contracts\PushContract;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class Notification implements ShouldQueue
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

        NotificationModel::createMain($meeting->owner, $meeting, $meeting->date);

        /*$not = new NotificationModel();
        $not->setUser($meeting->owner);
        $not->setModel($meeting);
        $not->date_active = $meeting->date;
        $not->save();*/

    }
}
