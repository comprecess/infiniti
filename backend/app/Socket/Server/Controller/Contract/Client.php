<?php
namespace App\Socket\Server\Controller\Contract;

use Ratchet\ConnectionInterface;

interface Client
{
    public function getName() :string;
    public function client(array $data, ConnectionInterface $conn);
}
