<?php

namespace App\Listeners\Catalog\Meeting;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
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

        $method = 'Delete';
        if($meeting->service_update) {
            $method = 'Update';
        }

        $object = "\\App\\Mail\\Catalog\\{$method}\\Meeting";

        $users = $meeting->model->getUsersCatalog();

        Mail::to($meeting->owner->getEmail())
            ->bcc($users->pluck('email')->toArray())
            ->send(new $object($meeting));


    }
}
