<?php

namespace App\Listeners\Catalog\Meeting\Create;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Mail;

class SendEmail implements ShouldQueue
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

        if($meeting->responseFail()) {
            return;
        }

        $users = $meeting->model->getUsersCatalog();

        Mail::to($meeting->owner->getEmail())
            ->bcc($users->pluck('email')->toArray())
            ->send(new \App\Mail\Catalog\MeetingReminder($meeting));


    }
}
