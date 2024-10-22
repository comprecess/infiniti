<?php


namespace App\Http\Controllers\Api\Traits;


use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Auth;

trait IsAuthTrait
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

        return $this->user;

    }

}
