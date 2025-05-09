<?php


namespace App\Services\Push;


use App\Services\Push\Contracts\PushContract;
use App\Models\Push as PushModel;
use Berkayk\OneSignal\OneSignalClient;


class OneSignal extends Push implements PushContract
{

    private $onesignal = null;

    public function __construct()
    {
        $this->onesignal = new OneSignalClient(
            env('ONESIGNAL_APP_ID'),
            env('ONESIGNAL_REST_API_KEY'),
            env('ONESIGNAL_USER_AUTH_KEY'),
        );
    }

    public function send(PushModel $model, $title, $message)
    {
//        OneSignalClient::sendNotificationToUser(
//            $message,
//            $model->hash
//        );

//        $onesignal = new OneSignalClient(
//            env('ONESIGNAL_APP_ID'),
//            env('ONESIGNAL_REST_API_KEY'),
//            env('ONESIGNAL_USER_AUTH_KEY'),
//        );

        $this->onesignal->sendNotificationToUser($message, $model->endpoint);
    }

    public function test()
    {
        return $this->onesignal->getNotifications();
    }

}
