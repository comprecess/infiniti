<?php
namespace App\Socket\Server\Controller\Traits;

use Illuminate\Support\Arr;

trait RoomTrait
{
    public function checkRoom($name = null, $user = null)
    {
        $name = $name ?? $this->getName();
        $user = $user ?? $this->userData;
        return in_array($name, Arr::get($user, 'room', []));
    }

    public function checkClientRoom($client, $name = null)
    {
        $name = $name ?? Arr::get($this->data, 'room');
        return $this->checkRoom($name, $this->socket->getUser($client));
    }

    public function countRoomClient(string|array $rooms)
    {
        $count = [];
        $i = 0;
        foreach ($this->clients as $client) {
            if(is_string($rooms)) {
                if($this->checkClientRoom($client, $rooms)) {
                    $i++;
                }
            }else{
                if(!$rooms) {
                    break;
                }
                foreach($rooms as $room) {
                    if($this->checkClientRoom($client, $room)) {
                        $count[$room] = Arr::get($count, $room, 0) + 1;
                    }
                }
            }
        }

        return is_string($rooms) ? $i : $count;
    }
}
