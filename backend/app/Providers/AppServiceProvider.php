<?php

namespace App\Providers;

use App\Contracts\FilterBusinessModelContract;
use App\Contracts\FilterContract;
use App\Contracts\MeetingContract;
use App\Models\Users\Client;
use App\Services\Currency\Contract\CurrencyServiceContract;
use App\Services\Currency\CurrencyFreaks;
use App\Services\Filter;
use App\Services\FilterBusinessModel;
use App\Services\Pay\Contract\PayContract;
use App\Services\Pay\Pay;
use App\Services\Push\Contracts\PushContract;
use App\Services\Push\OneSignal;
use App\Services\ZoomMeeting;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{

    public $bindings = [
        FilterContract::class => Filter::class,
        FilterBusinessModelContract::class => FilterBusinessModel::class,
        PayContract::class => Pay::class,
        CurrencyServiceContract::class => CurrencyFreaks::class,
        #Meering
        MeetingContract::class => ZoomMeeting::class,
        #Push
        PushContract::class => OneSignal::class

    ];

    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(\App\Services\Push\Contracts\PushContract::class, \App\Services\Push\VapidPush::class);
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Collection::macro('paginate', function($perPage, $total = null, $page = null, $pageName = 'page'): LengthAwarePaginator {
            $page = $page ?: LengthAwarePaginator::resolveCurrentPage($pageName);

            return new LengthAwarePaginator(
                $this->forPage($page, $perPage)->values(),
                $total ?: $this->count(),
                $perPage,
                $page,
                [
                    'path' => LengthAwarePaginator::resolveCurrentPath(),
                    'pageName' => $pageName,
                ]
            );
        });

//        Relation::enforceMorphMap([
//            'Client' => Client::class,
//        ]);
    }
}
