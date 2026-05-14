<?php

namespace App\Models\Support;

use App\Models\Users\Admin;
use App\Models\Users\Client;
use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\FileStorageTrait;
use Illuminate\Database\Eloquent\SoftDeletes;

class SysTicket extends Model
{
    use FileStorageTrait;

    public $table = 'sys_tickets';

    const STATUS_OPEN       = 'Open';
    const STATUS_ANSWERED   = 'Answered';
    const STATUS_IN_PROCESS = 'In Process';
    const STATUS_CLOSED     = 'Closed';

    const STATUSES = [
        self::STATUS_OPEN,
        self::STATUS_ANSWERED,
        self::STATUS_IN_PROCESS,
        self::STATUS_CLOSED,
    ];

    const URGENCY_LOW    = 'Low';
    const URGENCY_MEDIUM = 'Medium';
    const URGENCY_HIGH   = 'High';

    const URGENCIES = [
        self::URGENCY_LOW,
        self::URGENCY_MEDIUM,
        self::URGENCY_HIGH,
    ];

    protected $fillable = [
        'did', 'aid', 'userid', 'subject', 'message',
        'status', 'urgency', 'email', 'cc', 'bcc',
        'notes', 'tags', 'source', 'client_read', 'admin_read',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // ── Relations ──

    public function department()
    {
        return $this->belongsTo(SysTicketDepartment::class, 'did');
    }

    public function assignee()
    {
        return $this->belongsTo(Admin::class, 'aid');
    }

    public function client()
    {
        return $this->belongsTo(Client::class, 'userid');
    }

    public function replies()
    {
        return $this->hasMany(SysTicketReply::class, 'tid')->orderBy('id', 'asc');
    }

    // ── Scopes ──

    public function scopeForAdmin($query, $adminId = null)
    {
        // If admin has all_data access — see all tickets
        // Otherwise only tickets assigned to them
        if ($adminId) {
            $query->where(function ($q) use ($adminId) {
                $q->where('aid', $adminId)->orWhereNull('aid');
            });
        }
        return $query;
    }

    public function scopeOpen($query)
    {
        return $query->whereIn('status', [self::STATUS_OPEN, self::STATUS_IN_PROCESS]);
    }
}
