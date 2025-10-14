<?php

namespace App\Listeners\Invoice;

use App\Events\InvoicePay;
use App\Models\Resident\Invoices\InvoiceItem;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class Check implements ShouldQueue
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
    public function handle(InvoicePay $event): void
    {
        $invoice = $event->model;
        $items = $invoice->items;
        $currency = $invoice->getCurrencyIso;

        if(count($items) == 1) {
            $item = $items->first();
            if($item->type == InvoiceItem::TYPE[0]) {
                $transactions = $invoice->transaction()
                    ->whereNull('c1')
                    ->with(['getCurrencyIso', 'currencyHistory'])
                    ->get();
                $user = $invoice->user;
                $transactions->each(function ($item) use($user, $currency){
                    $item->c1 = 1;
                    $item->save();
                    $user->balance += $item->transformPrice('amount', $currency);
                });
                $user->save();
            }
        }
    }
}
