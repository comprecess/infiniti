<?php

namespace App\Models\Resident\Project;


use App\Models\Traits\UserTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Calendar extends Model
{
    use HasFactory, UserTrait;

    protected $table = 'sys_events';

    public $timestamps = false;

    protected $adminColumn = 'aid';

    protected $casts = [
        'start' => 'datetime',
        'end' => 'datetime',
    ];

}
