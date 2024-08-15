<?php

namespace App\Http\Middleware\Auth;

use Illuminate\Auth\Middleware\Authenticate;

class AuthenticateLastTime extends Authenticate
{

     protected function authenticate($request, array $guards)
     {
        if (empty($guards)) {
            $guards = [null];
        }

        foreach ($guards as $guard) {
            if ($this->auth->guard($guard)->check()) {
                $result = $this->auth->shouldUse($guard);
                $user = $this->auth->user();
                if($user->isLastTime()) {
                    return $result;
                }
            }
        }

        $this->unauthenticated($request, $guards);
    }

}
