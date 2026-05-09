<?php

namespace App\Listeners\Project;

use App\Models\Resident\Project\ProjectLog;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Events\Project\Log as LogEvent;
use App\Services\Push\Contracts\PushContract;
use App\Models\Users\Admin;

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
            $data = \App\Models\Log::comparisonModelsMismatch($event->model, $event->oldModel);
        }else{
            $data = ['class' => $event->model::class, 'data' => $event->model->toArray()];
        }

        ProjectLog::create($event->model, $event->type, $event->user, $data, $event->description);

        try {
            $push = app(PushContract::class);
            $projectName = method_exists($event->model, 'getName') ? $event->model->getName() : class_basename($event->model);
            $adminActionDate = now()->subMonth(3);
            $admins = Admin::where((new Admin())->getColumnLastTime(), '>=', $adminActionDate)->get();
            foreach ($admins as $admin) {
                $push->sendUser($admin, 'Infiniti', 'Project updated: ' . $projectName, '/admin/dashboard');
            }
        } catch (\Throwable $e) {
            \Log::error('Push (project): ' . $e->getMessage());
        }
    }
}
