<?php
namespace App\Socket\Server\Controller;


use App\Socket\Server\Controller\Contract\Server;
use App\Socket\Server\Controller\Contract\Client;
use App\Socket\Server\Controller\Traits\RoomTrait;
use Illuminate\Support\Arr;
use Ratchet\ConnectionInterface;

class Task extends Controller implements Server, Client
{
    use RoomTrait;

    public function getName(): string
    {
        // TODO: Implement getName() method.
        return 'task';
    }

    public function client(array $data, ConnectionInterface $conn)
    {
        $stat = $this->sendAll(Arr::get($data, 'data'), function($client) use($conn){
            return $client != $conn && $this->checkClientRoom($client);
        });

        $conn->send($this->response($stat));
    }
}
