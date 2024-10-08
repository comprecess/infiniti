<?php

namespace App\Models\Resident\Settings;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RolePermission extends Model
{
    use HasFactory;

    protected $table = 'sys_permissions';

    public $timestamps = false;

    public function access()
    {
        return $this->hasMany(RoleAccess::class, 'pid');
    }

}
