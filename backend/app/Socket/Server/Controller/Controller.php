<?php


namespace App\Socket\Server\Controller;


use App\Socket\Server\ControllerWebSocket;

class Controller
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
        return json_encode(['code' => $code, 'data' => $data, 'c' => $name]);
    }

}
