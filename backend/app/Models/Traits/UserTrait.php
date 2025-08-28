<?php


namespace App\Models\Traits;


use App\Models\Users\Admin;
use App\Models\Users\Client;

trait UserTrait
{
    public function getAdminColumn()
    {
        return $this->adminColumn ?? 'o';
    }

    public function getClientColumn()
    {
        return $this->clientColumn ??'cid';
    }

    public function client()
    {
        return $this->belongsTo(Client::class, $this->getClientColumn());
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class, $this->getAdminColumn());
    }

    public function checkAccessAbort(...$data)
    {
        $admin = auth()->user();
        if(!($admin instanceof Admin)) {
            return $this;
        }

        if($admin->checkAccess(...$data) === 0 && $admin->id != $this->{$this->getAdminColumn()}) {
            abort(403);
        }

        return $this;
    }

    public function scopeCheckAccess($query, ...$data) :void
    {
        $admin = auth()->user();
        if(!($admin instanceof Admin)) {
            return;
        }

        if($admin->checkAccess(...$data) === 0) {
            $query->where($this->getTable() .'.' . $this->getAdminColumn(), $admin->id);
        }
    }
}
