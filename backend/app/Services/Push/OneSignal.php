<?php


namespace App\Services\Push;


use App\Services\Push\Contracts\PushContract;
use App\Models\Push as PushModel;
use Berkayk\OneSignal\OneSignalClient;


class OneSignal extends Push implements PushContract
{

    public function send(PushModel $model, $title, $message)
    {
        OneSignalClient::sendNotificationToUser(
            $message,
            $model->hash
        );
    }

}
