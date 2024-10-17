<?php

namespace App\Models\Resident\Settings;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    protected $table = 'sys_ticketdepartments';
}
