<?php

namespace App\Listeners\Project;

use App\Models\Resident\Project\ProjectLog;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
Use App\Events\Project\Log as LogEvent;

class Log implements ShouldQueue
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
    public function handle(LogEvent $event): void
    {
        $data = null;
        if($event->oldModel) {
            dd($event->model, $event->oldModel);
            $data = \App\Models\Log::comparisonModelsMismatch($event->model, $event->oldModel);
        }else{
            $data = ['class' => $event->model::class, 'data' => $event->model->toArray()];
        }

        ProjectLog::create($event->model, $event->type, $event->user, $data, $event->description);
    }
}
