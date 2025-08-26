<?php
namespace App\Socket\Server\Controller;


use App\Socket\Server\Controller\Contract\Server;
use App\Socket\Server\Controller\Contract\Client;
use Ratchet\ConnectionInterface;

class Notification extends Controller implements Server, Client
{

    public function getName(): string
    {
        // TODO: Implement getName() method.
        return 'notification';
    }

    public function client(array $data, ConnectionInterface $conn)
    {
        $conn->send('test');
        print_r($this->socket->getUser());
    }
}
