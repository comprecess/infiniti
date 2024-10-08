<?php

namespace App\Models\Resident\Settings;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoleAccess extends Model
{
    use HasFactory;

    protected $table = 'sys_staffpermissions';

    public $timestamps = false;

    public function setViewAttribute($value)
    {
        $this->attributes['can_view'] =(bool) $value;
    }

    public function setEditAttribute($value)
    {
        $this->attributes['can_edit'] = (bool)$value;
    }

    public function setCreateAttribute($value)
    {
        $this->attributes['can_create'] =(bool) $value;
    }

    public function setDeleteAttribute($value)
    {
        $this->attributes['can_delete'] =(bool) $value;
    }

    public function setAllAttribute($value)
    {
        $this->attributes['all_data'] = (bool) $value;
    }

    public function getViewAttribute($value)
    {
        return $this->can_view;
    }

    public function getEditAttribute($value)
    {
        return $this->can_edit;
    }

    public function getCreateAttribute($value)
    {
        return $this->can_create;
    }

    public function getDeleteAttribute($value)
    {
        return $this->can_delete;
    }

    public function getAllAttribute($value)
    {
        return $this->all_data;
    }


    public function role()
    {
        return $this->belongsTo(Role::class, 'rid');
    }

    public function permission()
    {
        return $this->belongsTo(RolePermission::class, 'pid');
    }

}
