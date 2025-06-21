<?php

namespace App\Console\Commands\Invoices;

use App\Models\Notification;
use App\Models\Resident\Invoices\Invoice;
use Illuminate\Console\Command;

class ExpiredInvoice extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:expired-invoice';

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
        $invoices = Invoice::where('date', '<=', $date)
            ->where('duedate', '>=', $date)
            ->get();

        foreach($invoices as $invoice) {
            $user = $invoice->user;
            $not = Notification::whereJsonContains('data->invoice', $invoice->id)
                ->where(function($q) use($user){
                    $q->where('user_type', $user::class)
                        ->where('user_id', $user->id);
                })
                ->first();
            if($invoice->status == Invoice::STATUS[0]) {
                $url = $invoice->getPublicUrl();
                $data = [
                    'summa' => $invoice->transformPrice('subtotal', $user->getCurrencyIso, true),
                    'date' => $invoice->duedate?->format('d/m/Y'),
                    'link' => $url
                ];
                if(!$not){
                    Notification::createMain(user: $user, message: __('notification.Invoice.action', $data), data: ['invoice' => $invoice->id], dateActive: $invoice->duedate);
                }
                Notification::sendPush(user: $user, message: __('notification.Invoice.actionPush', $data), url: $url);

            }else{
                if($not) {
                    $not->date_active = null;
                    $not->viewed = 1;
                    $not->save();
                }
            }
        }

    }
}
