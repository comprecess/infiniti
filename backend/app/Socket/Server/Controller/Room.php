<?php
namespace App\Socket\Server\Controller;

use App\Socket\Server\Controller\Contract\Main;
use App\Socket\Server\Controller\Traits\RoomTrait;
use Illuminate\Support\Arr;
use Ratchet\ConnectionInterface;

class Room extends Controller implements Main
{

    use RoomTrait;

    public function getName(): string
    {
        // TODO: Implement getName() method.
        return 'room';
    }

    public function main(array $data, ConnectionInterface $conn)
    {

        $in = Arr::get($data, 'data.in');
        $out = Arr::get($data, 'data.out');
        $command = Arr::get($data, 'data.command');
        $room = $in ?? $out;

        if($room) {
            if ($in) {
                $this->roomIn($in, $conn);
            } elseif ($out) {
                $this->roomOut($out, $conn);
            }

            $this->sendAll($this->getStat($room), function($client) use($room){
                return $this->checkClientRoom($client, $room);
            }, ['room' => $room]);
            return true;
        }

        if($command) {
            $method = strtolower($command) . "Command";
            if(method_exists($this, $method)){
                return $this->{$method}($data, $conn);
            }
        }

        return $conn->send($this->response(code: 404));
    }

    private function listCommand($data, $conn)
    {
        return $conn->send($this->response(['rooms' => Arr::get($this->userData, 'room', [])]));
    }

    private function onlineCommand($data, $conn)
    {
        $nameRoom = Arr::get($this->data, 'room');
        $user = $this->socket->getUser($conn);
        $listRoom = Arr::get($user, 'room', []);

        $result = $this->countRoomClient($nameRoom ?? $listRoom);

        if(is_array($listRoom)) {
            $obj = [];
        }else{
            $obj = ['room' => $result];
            $result = ['online' => $result];
        }

        return $conn->send($this->response(data: $result, allResp: $obj));
    }

    private function roomIn($name, $conn)
    {
        $rooms = collect(Arr::get($this->socket->getUser($conn), 'room', []));

        if($rooms->count() > 10 && $rooms->where($name)->count() == 0) {
            $rooms->pull(0);
        }

        $rooms->push($name);
        $rooms = $rooms->unique();
        $this->save($rooms->toArray(), $conn);
    }

    private function roomOut($name, $conn)
    {
        $rooms = collect(Arr::get($this->userData, 'room', []));

        $key = $rooms->search($name);
        if($key !== false) {
            $rooms->pull($key);
            $this->save($rooms->toArray(), $conn);
        }
    }

    private function save(array $data, $conn)
    {
        $this->socket->setUser(
            $conn, [$this->getName() => array_values($data)]
        );
    }

    private function getStat($name)
    {
        $stat = ['clients' => count($this->clients), 'inRoom' => $this->countRoomClient($name)];
        return $stat;
    }

}
