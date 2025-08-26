<?php


namespace App\Socket\Server\Controller;


use App\Socket\Server\Controller\Contract\Main;
use App\Socket\Server\Controller\Contract\Server;
use App\Socket\Server\ControllerWebSocket;
use Illuminate\Support\Arr;
use Ratchet\ConnectionInterface;

class Controller implements Server, Main
{
    public function __construct(
        protected array $userData,
        protected $clients,
        protected ControllerWebSocket $socket
    )
    {}

    public function response($data = null, $code = 200)
    {
        $name = null;
        if(method_exists($this, 'getName')) {
            $name = $this->getName();
        }
        return json_encode(['code' => $code, 'data' => $data, 'c' => $name]) . "\n";
    }

    public function getName(): string
    {
        return 'controller';
    }

    public function server(array $data, ConnectionInterface $conn)
    {
        echo ($this->getName());
        $stat = ['clients' => count($this->clients)];
        $i = 0;
        $message = Arr::get($data, 'data');
        if($message) {
            foreach ($this->clients as $client) {
                if ($client != $conn && $this->checkMessageSend($data, $client)) {
                    $client->send($this->response($message));
                    $i++;
                }
            }
        }
        $stat['sent'] = $i;
        $conn->send($this->response($stat));
    }

    private function checkMessageSend($data, $client) :bool
    {
        $class = Arr::get($data, 'user.class');
        $auth = $this->socket->getUser($client);

        if(!$class){
            return false;
        }

        if(
            $class == 'all'
            || ($class == 'auth' && $auth)
        ) {
            return true;
        }

        if($auth && Arr::get($auth, 'class') == $class) {
            $id = Arr::get($data, 'user.id');

            if(!$id) {
                return true;
            }

            return Arr::get($auth, 'id') == $id;
        }

        return false;
    }

    public function main(array $data, ConnectionInterface $conn)
    {

    }
}
