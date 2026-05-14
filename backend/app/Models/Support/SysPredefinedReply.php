<?php

namespace App\Models\Support;

use Illuminate\Database\Eloquent\Model;

class SysPredefinedReply extends Model
{
    public $table = 'sys_ticketpredefinedreplies';

    protected $fillable = [
        'rname', 'reply', 'tags', 'attachments',
        'created_by', 'updated_by',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
