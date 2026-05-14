<?php

namespace App\Models\Support;

use App\Models\Users\Admin;
use App\Models\Users\Client;
use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\FileStorageTrait;

class SysTicketReply extends Model
{
    use FileStorageTrait;

    public $table = 'sys_ticketreplies';

    const TYPE_PUBLIC   = 'public';
    const TYPE_INTERNAL = 'internal';

    protected $fillable = [
        'tid', 'userid', 'reply_type', 'message',
        'replied_by', 'admin', 'attachments',
        'client_read', 'admin_read',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function ticket()
    {
        return $this->belongsTo(SysTicket::class, 'tid');
    }

    public function adminUser()
    {
        return $this->belongsTo(Admin::class, 'userid');
    }

    public function clientUser()
    {
        return $this->belongsTo(Client::class, 'userid');
    }
}
