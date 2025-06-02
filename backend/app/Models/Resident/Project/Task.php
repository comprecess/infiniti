<?php

namespace App\Models\Resident\Project;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    const STATUS = ['Not Started', 'In Progress', 'Completed', 'Deferred', 'Waiting', 'Archived'];
    const STATUS_COMPLETED = [self::STATUS[2], self::STATUS[5]];

    protected $table = 'sys_tasks';



}
