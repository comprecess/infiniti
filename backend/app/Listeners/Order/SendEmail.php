<?php

namespace App\Listeners\Order;

use App\Events\User\CreateOrder;
use App\Mail\Order\SendMail;
use App\Mail\ResetPassword;
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
    public function handle(CreateOrder $event): void
    {
        $invoice = $event->getInvoice();
        Mail::to($invoice->user)->send(new SendMail($invoice));
    }
}
