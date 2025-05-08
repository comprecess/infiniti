<?php


namespace App\Services;


use Illuminate\Support\Arr;
use Minishlink\WebPush\Subscription;
use Minishlink\WebPush\WebPush;
use App\Models\Push as PushModel;

class Push
{

    public static function send(PushModel $model, $title, $message)
    {
        $user = $model->user;
        $auth = [
            'VAPID' => [
                'subject' => $user->getEmail(),
                'publicKey' => env('VAPID_PUBLIC_KEY'),
                'privateKey' => env('VAPID_PRIVATE_KEY'),
            ],
        ];

        $data = $model->keys;
        $webPush = new WebPush($auth);

        $subscription = Subscription::create([
            'endpoint' => $model->endpoint,
            'publicKey' => Arr::get($data, 'p256dh'),
            'authToken' => Arr::get($data, 'auth'),
            'contentEncoding' => 'aes128gcm',
        ]);

        $webPush->sendOneNotification(
            $subscription,
            \json_encode([
                'title' => $title,
                'body' => $message,
            ])
        );
    }

}
