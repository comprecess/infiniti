<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;


class ResidentController extends UserController
{
    public function index()
    {
        $resident = $this->isAuth(false);

        return new UserResource($this->user);
    }
}
