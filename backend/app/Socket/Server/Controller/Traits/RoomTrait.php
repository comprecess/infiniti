<?php
namespace App\Socket\Server\Controller\Traits;

use Illuminate\Support\Arr;

trait RoomTrait
{
    public function checkRoom($name = null, $user = null)
    {
        $name = $name ?? $this->getName();
        $user = $user ?? $this->userData;
        return in_array($name, Arr::get($user, 'room'));
    }

    public function checkClientRoom($client, $name = null)
    {
        return $this->checkRoom($name, $this->socket->getUser($client));
    }
}
