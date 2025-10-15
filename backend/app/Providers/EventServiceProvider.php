<?php

namespace App\Providers;

use App\Events\Catalog;
use App\Events\InvoicePay;
use App\Events\Resident\Talents\DeleteTalent;
use App\Events\Resident;
use App\Events\User\CreateOrder;
use App\Events\UserIsAuthorized;
use App\Listeners\Catalog\Meeting;
use App\Listeners\CheckCart;
use App\Listeners\Order\SendEmail;
use App\Listeners\Resident\Talents\DeleteCatalogItem;
use App\Listeners;
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
        /** Создание встречи*/
        Catalog\MeetingCreate::class => [
            Meeting\Create\ServiceCreate::class,
            Meeting\Create\Employment::class,
            Meeting\Create\SendEmail::class,
            Meeting\Create\Notification::class
        ],
        /** Обновление встречи или удаление */
        Catalog\MeetingUpdate::class => [
            Meeting\SendEmail::class,
            Meeting\Notification::class,
        ],
        /** Удаление таланта  */
        DeleteTalent::class => [
            DeleteCatalogItem::class
        ],
        /** Удаление транзакции */
        Resident\Transactions\Delete::class => [
            Listeners\Resident\Transaction\CalculateCategory::class
        ],
        /** Оплата */
        InvoicePay::class => [
            Listeners\Invoice\Check::class,
            Listeners\Invoice\AdminNotification::class
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
