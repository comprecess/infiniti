<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Auth;


class UserController extends Controller
{
    protected $user = null;

    protected function isAuth($hasExcept = true)
    {
        $this->user = Auth::guard('api_admin')->user();

        if(!$this->user) {
            $this->user = Auth::guard('api_client')->user();
        }

        if($hasExcept) {
            if(!$this->user) {
                throw new AuthenticationException('Unauthenticated.');
            }
        }

    }

    public function getUser()
    {
        $this->isAuth();

        return new UserResource($this->user);
    }
}
