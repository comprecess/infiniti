<?php


namespace App\Models\Traits;


use App\Models\Users\Client;

trait UserTrait
{
    public function client()
    {
        return $this->hasMany(Client::class, 'cid');
    }
}
