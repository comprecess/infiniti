<?php

namespace App\Console\Commands\Catalog;

use App\Models\Meeting;
use App\Models\Resident\Settings\Currency;
use App\Services\Currency\Contract\CurrencyServiceContract;
use App\Services\Currency\Dto;
use Illuminate\Console\Command;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class MeetingReminder extends Command
{
    const HOUR_TIME = 1;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:meeting-reminder';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Meeting reminder hourly and daily';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Push reminders: 15, 30, 60 minutes before
        $this->sendPushReminders();

        foreach([1,24] as $hour) {
            $time = now();
            $time->setSeconds(0);
            $start = $time->addHours($hour);
            $end = (clone $start)->addHours(self::HOUR_TIME);
            $meetings = Meeting::where('date', '>', $start)
                ->where('date', '<=', $end)
                ->whereNotNull('service_response')
                ->with(['owner'])
                ->get();

            if($meetings->count()) {
                Log::alert("Meeting-reminder start: " . $start->format("Y-m-d H:i:s"), $meetings->pluck('id')->toArray());
            }

            $meetings->each(function($meeting) use($hour){
                $model = $meeting->model;
                if(
                    $meeting->responseFail()
                    || !$model
                ) {
                    Log::alert("meeting-reminder id [{$meeting->id}] not send");
                    return true;
                }
                $users = $model->getUsersCatalog();
                Mail::to($meeting->owner->getEmail())
                    ->bcc($users->pluck('email')->toArray())
                    ->send(new \App\Mail\Catalog\MeetingReminder($meeting, $hour));

            });
        }
    }

    private function sendPushReminders(): void
    {
        try {
            $push = app(\App\Services\Push\Contracts\PushContract::class);
            // Meetings are stored in local timezone (Europe/Moscow) but in UTC column
            // So we compare against Moscow time treated as UTC
            $now = now('Europe/Moscow')->setTimezone('UTC')->setTimezone('UTC');
            // Simpler: meetings store "Moscow wall clock time" in UTC field
            // so offset = +3h from real UTC. Use Carbon::now() + 3h offset trick:
            $nowAdjusted = \Carbon\Carbon::now()->addHours(3); // Moscow offset

            foreach ([15, 30, 60] as $minutes) {
                $from = $nowAdjusted->copy()->addMinutes($minutes - 1);
                $to   = $nowAdjusted->copy()->addMinutes($minutes + 1);

                $meetings = Meeting::with('owner')
                    ->whereBetween('date', [$from, $to])
                    ->whereNull('deleted_at')
                    ->get();

                foreach ($meetings as $meeting) {
                    $cacheKey = "meeting_push_reminder_{$meeting->id}_{$minutes}";
                    if (\Illuminate\Support\Facades\Cache::has($cacheKey)) continue;

                    $owner = $meeting->owner;
                    if (!$owner) continue;

                    $push->sendUser(
                        $owner,
                        'Infiniti',
                        "Meeting in {$minutes} min (ID: {$meeting->id})",
                        '/admin/dashboard'
                    );
                    \Illuminate\Support\Facades\Cache::put($cacheKey, true, $now->copy()->addMinutes($minutes + 5));
                    Log::info("Push reminder {$minutes}min sent for meeting #{$meeting->id}");
                }
            }
        } catch (\Throwable $e) {
            Log::error('Push meeting reminder failed: ' . $e->getMessage());
        }
    }
}
