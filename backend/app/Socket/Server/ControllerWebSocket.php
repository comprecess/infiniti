<?php
namespace App\Socket\Server;

use App\Socket\Server\Controller;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use Ratchet\ConnectionInterface;
use Ratchet\RFC6455\Messaging\MessageInterface;

class ControllerWebSocket extends Socket
{
    private $users = [];

    private function list() :array
    {
        return [
            Controller\Auth::class,
            Controller\Notification::class
        ];
    }

    private function listMain() :array
    {
        return [
          'auth'
        ];
    }

    public function onMessage(ConnectionInterface $conn, MessageInterface $msg)
    {
        // TODO: Implement onMessage() method.
        $data = $this->messageFormJson($msg);
        $user = $this->getUser($conn);

        if(($auth = Arr::get($user, "auth")) || in_array($data['c'], $this->listMain())) {
            foreach($this->list() as $class) {
                $object = new $class($user, $this->clients, $this);
                if($object->getName() === $data['c']) {
                    if($type = Arr::get($auth, 'type')) {
                        if(method_exists($object, $type)) {
                            return $object->{$type}($data, $conn);
                        }
                    }else{
                        return $object->main($data, $conn);
                    }

                    return $conn->send(json_encode(['code' => 402]));
                }
            }
        }else{
            return $conn->send(json_encode(['code' => 404]));
        }
    }

    function onClose(ConnectionInterface $conn)
    {
        unset($this->users[$conn->resourceId]);
        parent::onClose($conn);
    }


    private function messageFormJson(MessageInterface $msg) :?array
    {
        try {
            $message = $msg->getContents();
            $startJson = strpos($message, '{');
            $message = mb_substr($message, $startJson);
            return json_decode($message, true);

        }catch (\Exception $e){
            Log::info($e->getMessage(), $e->getTrace());
        }

        return null;
    }

    public function setUser(ConnectionInterface $conn, array $data) :void
    {
        $user = $this->getUser();
        $this->users[$conn->resourceId] = array_merge($user, $data);
    }

    public function getUser(?ConnectionInterface $conn = null) :array
    {
        if($conn === null) {
            return $this->users;
        }else{
            return Arr::get($this->users, $conn->resourceId, []);
        }
    }
}
