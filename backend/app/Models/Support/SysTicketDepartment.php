<?php

namespace App\Models\Support;

use App\Models\Users\Admin;
use Illuminate\Database\Eloquent\Model;

class SysTicketDepartment extends Model
{
    public $table = 'sys_ticketdepartments';

    protected $fillable = [
        'dname', 'description', 'email',
        'hidden', 'delete_after_import',
        'host', 'port', 'username', 'password', 'encryption',
        'default_aid', 'sorder',
    ];

    protected $casts = [
        'hidden'              => 'boolean',
        'delete_after_import' => 'boolean',
        'created_at'          => 'datetime',
        'updated_at'          => 'datetime',
    ];

    public function defaultAssignee()
    {
        return $this->belongsTo(Admin::class, 'default_aid');
    }

    public function tickets()
    {
        return $this->hasMany(SysTicket::class, 'did');
    }

    public function scopeVisible($query)
    {
        return $query->where('hidden', 0);
    }
}
