<?php


namespace App\Models\Traits;


use App\Models\Users\Admin;
use App\Models\Users\Client;

trait UserDefTrait
{
    public function user()
    {
        return $this->morphTo('user');
    }

    public function setUser(Admin|Client $user)
    {
        $this->user_type = $user::class;
        $this->user_id = $user->id;
    }
}
