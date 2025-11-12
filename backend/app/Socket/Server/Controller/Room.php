<?php
namespace App\Socket\Server\Controller;


use App\Models\Users\Admin;
use App\Models\Users\Client;
use App\Socket\Server\Controller\Contract\Main;
use Illuminate\Support\Arr;
use Ratchet\ConnectionInterface;

class Room extends Controller implements Main
{

    public function getName(): string
    {
        // TODO: Implement getName() method.
        return 'room';
    }

    public function main(array $data, ConnectionInterface $conn)
    {

        $in = Arr::get($data, 'data.in');
        $out = Arr::get($data, 'data.out');

        if($in) {
            $this->roomIn($in, $conn);
            return $conn->send($this->response());
        }elseif ($out) {
            $this->roomOut($out, $conn);
            return $conn->send($this->response());
        }

        return $conn->send($this->response(code: 404));
    }

    private function roomIn($name, $conn)
    {
        $rooms = collect(Arr::get($this->userData, 'rooms', []));

        if($rooms->count() > 10) {
            $rooms->pull(0);
        }

        $rooms->push($name);
        $this->save($rooms->toArray(), $conn);
    }

    private function roomOut($name, $conn)
    {
        $rooms = collect(Arr::get($this->userData, 'rooms', []));

        $key = $rooms->search($name);
        if($key !== false) {
            $rooms->pull($key);
            $this->save($rooms->toArray(), $conn);
        }
    }

    private function save(array $data, $conn)
    {
        $this->socket->setUser(
            $conn,
            [$this->getName() => $data]
        );
    }

}
