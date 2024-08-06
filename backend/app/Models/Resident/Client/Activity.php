<?php

namespace App\Models\Resident\Client;

use App\Models\Traits\UserTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasFactory, UserTrait;

    protected $table = "sys_activity";
}
