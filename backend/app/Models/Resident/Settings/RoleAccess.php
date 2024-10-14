<?php

namespace App\Models\Resident\Settings;

use App\Models\Traits\BootTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoleAccess extends Model
{
    use HasFactory, BootTrait;

    const TYPE_ACCESS = ['view', 'edit', 'create', 'delete', 'all'];

    const ALL = 'all';
    const EDIT = 'edit';
    const CREATE = 'create';
    const VIEW = 'view';
    const DELETE = 'delete';

    protected $table = 'sys_staffpermissions';

    public $timestamps = false;

    public static function creatingEvent($item)
    {
        return self::systemName() !== $item->shortname;
    }

    public static function systemName()
    {
        return '_global_admin';
    }

    public function setViewAttribute($value)
    {
        $this->attributes['can_view'] = $value ? 1 : 0;
    }

    public function setEditAttribute($value)
    {
        $this->attributes['can_edit'] = $value  ? 1 : 0;
    }

    public function setCreateAttribute($value)
    {
        $this->attributes['can_create'] =$value  ? 1 : 0;
    }

    public function setDeleteAttribute($value)
    {
        $this->attributes['can_delete'] = $value ? 1 : 0;
    }

    public function setAllAttribute($value)
    {
        $this->attributes['all_data'] = $value  ? 1 : 0;
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

    public static function systemAccess($data = true)
    {
        $access = new self();
        $access->shortname = self::systemName();
        if(is_array($data)) {
            foreach ($data as $key => $value) {
                $access->{$key} = $value;
            }
        }elseif (is_bool($data)) {
            foreach (self::TYPE_ACCESS as $value) {
                $access->{$value} = $data ? 1 : 0;
            }
        }

        return $access;
    }

    public function abort($typeAccess = self::ALL)
    {
        if($this->{$typeAccess} == 0) {
            abort(403, $this->shortname);
        }
    }

}
