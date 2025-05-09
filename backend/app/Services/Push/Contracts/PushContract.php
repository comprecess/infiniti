<?php
namespace App\Services\Push\Contracts;

use App\Models\User;
use App\Models\Push;

interface PushContract
{
    public function sendUser(User $user,string $title, string $message);
    public function send(Push $push, string $title, string $message);
}
