<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Traits\IsAuthTrait;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;


class UserController extends Controller
{
    use IsAuthTrait;

    public function getUserModel($hasExcept = true)
    {
        $this->isAuth($hasExcept);
        return $this->user;
    }

    public function getUser()
    {
        $this->isAuth();

        return new UserResource($this->user);
    }
}
