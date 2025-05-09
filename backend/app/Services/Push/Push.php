<?php


namespace App\Services\Push;


use App\Models\Push as PushModel;
use App\Models\User;
use App\Services\Push\Contracts\PushContract;

abstract class Push implements PushContract
{
    public function send(PushModel $model, $title, $message)
    {

    }

    public function sendUser(User $user, string $title, string $message)
    {
        $user->pushSubscriptions()
            ->each(function($item) use($title, $message){
                $this->send($item, $title, $message);
            });
    }

}
