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
        foreach([1,24] as $hour) {
            $time = now();
            $time->setSeconds(0);
            $start = $time->addHours($hour);
            $end = (clone $start)->addHours(self::HOUR_TIME);
            $meetings = Meeting::where('date', '>', $start)
                ->where('date', '<=', $end)
                ->whereNotNull('service_response')
                ->with(['model', 'owner'])
                ->get();

            if($meetings->count()) {
                Log::alert("Meeting-reminder start: " . $start->format("Y-m-d H:i:s"), $meetings->pluck('id')->toArray());
            }

            $meetings->each(function($meeting) use($hour){
                if(
                    $meeting->responseFail()
                    || !$meeting->model
                ) {
                    Log::alert($meeting->responseFail() ? true : false);
                    Log::alert(!$meeting->model ? true : false);
                    Log::alert("meeting-reminder id [{$meeting->id}] not send");
                    return true;
                }
                $users = $meeting->model->getUsersCatalog();
                Mail::to($meeting->owner->getEmail())
                    ->bcc($users->pluck('email')->toArray())
                    ->send(new \App\Mail\Catalog\MeetingReminder($meeting, $hour));

            });
        }
    }
}
