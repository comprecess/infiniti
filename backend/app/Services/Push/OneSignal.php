<?php


namespace App\Services\Push;


use App\Models\User;
use App\Models\UserSettings;
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

    public function sendUser(User $user, string $title, string $message)
    {
        $sub = $user->pushSubscriptions;
        $pushSend = UserSettings::get('push', $user);
        if($sub->count() && $pushSend) {
            $this->onesignal->sendNotificationToUser($message, $sub->pluck('endpoint')->toArray());
        }
    }

    public function send(PushModel $model, $title, $message, $url = null)
    {
        $this->onesignal->sendNotificationToUser($message, $model->endpoint, $url);
    }

    public function test()
    {
        return $this->onesignal->getNotifications();
    }

}
