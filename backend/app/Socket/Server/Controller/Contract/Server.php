<?php
namespace App\Socket\Server\Controller\Contract;

use Ratchet\ConnectionInterface;

interface Server
{
    public function getName() :string;
    public function server(array $data, ConnectionInterface $conn);
}
