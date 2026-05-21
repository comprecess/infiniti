<?php
namespace App\Socket;

use App\Models\User;

class Client
{
    const USER = ['all', 'auth'];

    private $client = null;
    private $data = [];

    public function __construct()
    {
        $host = '127.0.0.1';
        $port = config('socket.port', env('SOCKET_PORT', 8080));

        $this->client = new \WebSocket\Client("ws://{$host}:{$port}/");
        $this->auth();

    }

    public function auth()
    {
        $token = config('socket.token', env('SOCKET_SERVER_TOKEN'));

        return $this->send([
            'c' => 'auth',
            'data' => [
                'token' => $token
            ]
        ]);
    }

    public function setController(string $controller)
    {
        $this->data['c'] = $controller;
        return $this;
    }

    public function setData(array $data = null) :Client
    {
        $this->data['data'] = array_merge($this->data['data'] ?? [], $data);
        return $this;
    }

    public function setUser(string|User $user = self::USER[0]) :Client
    {
        if(is_string($user)) {
           $this->data['user']['class'] = $user;
        }else{
            $this->data['user']['class'] = get_class($user);
            if($user->id) {
                $this->data['user']['id'] = $user->id;
            }
        }

        return $this;
    }

    public function sendData($parse = false, $clear =  true)
    {
        if($this->data) {
            $data = $this->data;
            if($clear) {
                $this->data = [];
            }
            return $this->send($data, $parse);
        }

        return null;
    }

    public function send(array|string $data, $parse = false) :?string
    {
        if(!is_string($data)) {
            $data = \json_encode($data);
        }

        $this->client->send($data);
        $result = $this->client->receive();
        return $parse ? json_decode($result, true) : $result;
    }

    public function __destruct()
    {
        $this->client->close();
    }

}
