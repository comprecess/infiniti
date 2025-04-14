<?php

namespace App\Providers;

use App\Events\Catalog\MeetingCreate;
use App\Events\User\CreateOrder;
use App\Events\UserIsAuthorized;
use App\Listeners\Catalog\MeetingEmployment;
use App\Listeners\Catalog\MeetingNotification;
use App\Listeners\Catalog\MeetingSendEmail;
use App\Listeners\Catalog\MeetingServiceCreate;
use App\Listeners\CheckCart;
use App\Listeners\Order\SendEmail;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
        UserIsAuthorized::class => [
            CheckCart::class
        ],
        CreateOrder::class => [
            SendEmail::class
        ],
        MeetingCreate::class => [
            MeetingServiceCreate::class,
            MeetingEmployment::class,
            MeetingSendEmail::class,
            MeetingNotification::class
        ]
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        //
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
