<?php
namespace App\Socket\Server\Controller;


use App\Models\Users\Admin;
use App\Models\Users\Client;
use App\Socket\Server\Controller\Contract\Main;
use Illuminate\Support\Arr;
use Ratchet\ConnectionInterface;

class Auth extends Controller implements Main
{

    public function getName(): string
    {
        // TODO: Implement getName() method.
        return 'auth';
    }

    public function main(array $data, ConnectionInterface $conn)
    {
        $token = Arr::get($data, 'data.token');
        $serverToken = env('SOCKET_SERVER_TOKEN');

        if(!$token) {
            $conn->send($this->response(null, 422));
        }

        //server
        if($token === $serverToken) {
            $this->socket->setUser(
                $conn,
                [
                    $this->getName() => [
                        'type' => 'server'
                    ]
                ]
            );
            return $conn->send($this->response());
        }

        //users
        foreach([Admin::class, Client::class] as $users) {
            $user = $users::where('api_token', $token)->first();

            if(!$user) {
                continue;
            }

            if($user->isLastTime(false)){
                $this->socket->setUser(
                    $conn,
                    [
                        $this->getName() => [
                            'type' => 'client',
                            'class' => $users,
                            'id' => $user->id
                        ]
                    ]
                );
                return $conn->send($this->response());
            }
        }

        return $conn->send($this->response(null, 401));
    }
}
