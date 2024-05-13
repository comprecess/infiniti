<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;


class ClientController extends UserController
{
    public function index()
    {
        $this->isAuth(false);

        return new UserResource($this->user);
    }
}
