<?php

namespace App\Console\Commands\Invoices;

use App\Models\Notification;
use App\Models\Resident\Invoices\Offer;
use Illuminate\Console\Command;

class ExpiredOffer extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:expired-offer';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = "Sends every day for the first 3 days, then every 7 days for 3 months";


    /**
     * Execute the console command.
     */
    public function handle()
    {
        $date = now()->format('Y-m-d');
        $offers = Offer::where('datecreated', '<=', $date)
            ->whereRaw("DATE_ADD(`datecreated`, INTERVAL 3 MONTH ) > '{$date}'")
            ->where('stage', Offer::STAGE[2])
            ->get();
        foreach($offers as $offer) {
            $day = $offer->datecreated->diffInDays($date);
            if($day < 4 || !($day % 7)) {
                $user = $offer->user;
                $url = $offer->getPublicUrl();
                Notification::createMain(user: $user, message: __('notification.Offer.action', ['code' => $offer->getCode(), 'link' => $url]),data: ['offer' => $offer->id]);
                Notification::sendPush(user: $user, message: __('notification.Offer.actionPush', ['code' => $offer->getCode()]), url: $url);
            }
        }

    }
}
