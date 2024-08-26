<?php

namespace App\Models\Resident\Settings;

use App\Models\Traits\UserTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmailLog extends Model
{
    use HasFactory, UserTrait;

    protected $table = "sys_email_logs";

    public $timestamps = false;

    protected $clientColumn = 'userid';

    protected $casts = [
        'date' => 'datetime',
    ];

    protected $fillable = [
        'email', 'subject', 'message', 'sender', 'date'
    ];
}
