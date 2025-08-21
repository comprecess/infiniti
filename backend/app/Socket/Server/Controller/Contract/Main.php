<?php
namespace App\Socket\Server\Controller\Contract;

use Ratchet\ConnectionInterface;

interface Main
{
    public function getName() :string;
    public function main(array $data, ConnectionInterface $conn);
}
