<?php


namespace App\Services\Push;


use App\Services\Push\Contracts\PushContract;
use Illuminate\Support\Arr;
use Minishlink\WebPush\Subscription;
use Minishlink\WebPush\WebPush;
use App\Models\Push as PushModel;

class Firebase extends Push implements PushContract
{

    public function send(PushModel $model, $title, $message, $url = null)
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

        return $webPush->sendOneNotification(
            $subscription,
            \json_encode([
                'title' => $title,
                'body' => $message,
            ])
        );
    }

}
