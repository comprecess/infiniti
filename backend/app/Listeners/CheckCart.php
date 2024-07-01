<?php

namespace App\Listeners;

use App\Events\UserIsAuthorized;
use App\Models\Users\Client;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class CheckCart
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
    public function handle(UserIsAuthorized $event): void
    {
        if($event->user instanceof Client) {

        }
    }
}
