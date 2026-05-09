<?php

namespace App\Listeners\Catalog\Meeting;


use App\Events\Catalog\MeetingDelete;
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
    public function handle(object $event): void
    {
        $meeting = $event->getMeeting();
        $meeting->refresh();

        NotificationModel::updateActiveAndCreateByModel($meeting->owner, $meeting);

        try {
            $push = app(\App\Services\Push\Contracts\PushContract::class);
            $push->sendUser($meeting->owner, 'Infiniti', 'Meeting updated: ' . $meeting->name, '/admin/dashboard');
        } catch (\Throwable $e) {
            \Log::error('Push (meeting update): ' . $e->getMessage());
        }
    }
}
