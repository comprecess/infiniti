<?php

namespace App\Console\Commands\Talents;

use App\Models\Catalog\User;
use App\Models\Notification;
use App\Models\Users\Admin;
use Illuminate\Console\Command;

class NewTalent extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:new-talent {--day=7}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = "";

    protected $day = 7;


    /**
     * Execute the console command.
     */
    public function handle()
    {
        $date = now();
        $day = (int) $this->option('day') ?? $this->day;
        $talentDayFirst = $date->copy()->subDays($day);
        $users = User::where('created_at', '>=', $talentDayFirst)->get();

        if($count = $users->count()) {
            $adminActionDate = $date->copy()->subMonth(3);
            $admins = Admin::where((new Admin())->getColumnLastTime(), '>=', $adminActionDate)->get();

            if($admins->count()) {
                foreach($admins as $admin) {
                    $not = Notification::whereJsonContains('data->action', 'new-talent')
                        ->where(function($q) use($admin){
                            $q->where('user_type', $admin::class)
                                ->where('user_id', $admin->id);
                        })
                        ->first();
                    $message =  __('notification.CatalogUser.newCount', ['day' => $day, 'count' => $count]);
                    if($not) {
                        $not->message = $message;
                        $not->viewed = 0;
                        $not->created_at = $date;
                        $not->save();
                    }else{
                        Notification::createMain(user: $admin, message: $message, data: ['action' => 'new-talent']);
                    }

                    Notification::sendPush(user: $admin, message: $message);
                }
            }
        }


    }
}
