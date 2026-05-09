<?php
namespace App\Services\Push;

use App\Models\Push as PushModel;
use App\Models\User;
use App\Models\UserSettings;
use App\Services\Push\Contracts\PushContract;
use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;

class VapidPush extends Push implements PushContract
{
    private WebPush $webPush;

    public function __construct()
    {
        $this->webPush = new WebPush([
            'VAPID' => [
                'subject'    => 'mailto:admin@infiniti.stream',
                'publicKey'  => env('VAPID_PUBLIC_KEY'),
                'privateKey' => env('VAPID_PRIVATE_KEY'),
            ],
        ]);
    }

    public function send(PushModel $model, $title, $message, $url = null): void
    {
        $payload = json_encode([
            'title' => $title ?: 'Infiniti',
            'body'  => $message ?: '',
            'url'   => $url ?: '/',
        ]);

        $keys = $model->keys ?? [];
        if (empty($keys['p256dh']) || empty($keys['auth'])) return;

        $sub = Subscription::create([
            'endpoint'        => $model->endpoint,
            'contentEncoding' => 'aesgcm',
            'keys'            => [
                'p256dh' => $keys['p256dh'],
                'auth'   => $keys['auth'],
            ],
        ]);

        $this->webPush->queueNotification($sub, $payload);
        $this->webPush->flush();
    }

    public function sendUser(User $user, string $title, string $message, $url = null): void
    {
        $pushSend = UserSettings::get('push', $user);
        if (!$pushSend) return;

        $subs = $user->pushSubscriptionsEnabled ?? collect();
        foreach ($subs as $item) {
            $this->send($item, $title, $message, $url);
        }
    }
}
