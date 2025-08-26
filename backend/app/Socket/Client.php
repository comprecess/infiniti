<?php
namespace App\Socket;

class Client
{
    private $client = null;

    public function __construct()
    {
        $host = '127.0.0.1';
        $port = env('SOCKET_PORT');

        $this->client = new \WebSocket\Client("ws://{$host}:{$port}/");
        $this->auth();

    }

    public function auth()
    {
        $token = env('SOCKET_SERVER_TOKEN');

        return $this->send([
            'c' => 'auth',
            'data' => [
                'token' => $token
            ]
        ]);
    }

    public function send(array|string $data) :?string
    {
        if(!is_string($data)) {
            $data = \json_encode($data);
        }

        $this->client->send($data);
        return $this->client->receive();
    }

    public function __destruct()
    {
        $this->client->close();
    }

}
