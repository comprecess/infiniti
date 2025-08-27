<?php
namespace App\Socket\Server;

use Illuminate\Support\Facades\Log;
use Ratchet\ConnectionInterface;
use Ratchet\RFC6455\Messaging\MessageInterface;
use \Ratchet\WebSocket\MessageComponentInterface;

class Socket implements MessageComponentInterface
{

    protected \SplObjectStorage|null $clients = null;

    public function __construct()
    {
        $this->clients = new \SplObjectStorage();
    }

    function onOpen(ConnectionInterface $conn)
    {
        // TODO: Implement onOpen() method.
        $this->clients->attach($conn);
//        echo "Connect: {$conn->resourceId}\r\n";
    }

    function onClose(ConnectionInterface $conn)
    {
        // TODO: Implement onClose() method.
        $this->clients->detach($conn);
//        echo "Disconnect: {$conn->resourceId}\r\n";
    }

    function onError(ConnectionInterface $conn, \Exception $e)
    {
        // TODO: Implement onError() method.
        Log::alert($e->getMessage(), $e->getTrace());
        $conn->close();
    }

    public function onMessage(ConnectionInterface $conn, MessageInterface $msg)
    {
        // TODO: Implement onMessage() method.
    }
}
