<?php


namespace App\Models\Traits;


use App\Models\Users\Admin;
use App\Models\Users\Client;

trait UserTrait
{
    public function client()
    {
        return $this->belongsTo(Client::class, $this->clientColumn ??'cid');
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class, $this->adminColumn ?? 'o');
    }
}
