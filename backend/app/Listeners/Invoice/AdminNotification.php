<?php

namespace App\Listeners\Invoice;

use App\Models\Notification;
use App\Models\Users\Admin;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class AdminNotification implements ShouldQueue
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
    public function handle(object $event): void
    {
        $date = now();
        $model = $event->model;
        $user = $model->user;
        $message = __('pay.adminNotification', [
           'typePay' =>  $event->type,
           'idAccount' =>  $user->id,
           'account' =>  $user->account,
           'idInvoice' =>  $model->id,
           'code' =>  $model->getCode(),
        ]);

        $adminActionDate = $date->copy()->subMonth(3);
//        $admins = Admin::where((new Admin())->getColumnLastTime(), '>=', $adminActionDate)->get();

        $admins = Admin::where('id', 19)->get();

        foreach($admins as $admin){
            Notification::createMain(
                user: $admin,
                model: $model,
                message: $message
            );
        }


    }
}
