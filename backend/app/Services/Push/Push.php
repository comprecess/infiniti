<?php


namespace App\Services\Push;


use App\Models\Push as PushModel;
use App\Models\User;
use App\Models\UserSettings;
use App\Services\Push\Contracts\PushContract;

abstract class Push implements PushContract
{
    public function send(PushModel $model, $title, $message, $url = null)
    {

    }

    public function sendUser(User $user, string $title, string $message, $url = null)
    {
        $pushSend = UserSettings::get('push', $user);
        if($pushSend) {
            $user->pushSubscriptions()
                ->each(function($item) use($title, $message, $url){
                    $this->send($item, $title, $message, $url);
                });
        }
    }

}
