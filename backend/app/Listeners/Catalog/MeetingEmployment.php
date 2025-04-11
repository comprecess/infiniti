<?php

namespace App\Listeners\Catalog;

use App\Contracts\MeetingContract;
use App\Events\Catalog\MeetingCreate;
use App\Models\Catalog\UserEmployment;
use App\Models\Meeting;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class MeetingEmployment implements ShouldQueue
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
        /**
         * @var Meeting $meeting
         */
        $meeting = $event->getMeeting();
        $meeting->refresh();

        if(!$meeting->service_response) {
            return;
        }

        $users = $meeting->model->getUsersCatalog();

        $users->each(function($item) use ($meeting){
            $end = clone $meeting->date;
            $end->addMinutes($meeting::TIME);
            $e = new UserEmployment();
            $e->id_catalog_user = $item->id;
            $e->model_type = $meeting::class;
            $e->model_id = $meeting->id;
            $e->from = $meeting->date;
            $e->to = $end;
            $e->save();
        });

    }
}
