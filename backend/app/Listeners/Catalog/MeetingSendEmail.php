<?php

namespace App\Listeners\Catalog;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Mail;

class MeetingSendEmail implements ShouldQueue
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

        if(!$meeting->service_response || Arr::get($meeting->service_response ?? [], 'data.id')) {
            return;
        }

        $users = $meeting->model->getUsersCatalog();

        Mail::to($meeting->owner->getEmail())
            ->bcc($users->pluck('email')->toArray())
            ->send(new \App\Mail\Catalog\MeetingReminder($meeting));


    }
}
