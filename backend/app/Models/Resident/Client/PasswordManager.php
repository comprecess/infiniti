<?php

namespace App\Models\Resident\Client;

use App\Models\Traits\UserTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PasswordManager extends Model
{
    use HasFactory, UserTrait;

    protected $table = "app_password_manager";

    protected $clientColumn = 'client_id';
    protected $adminColumn = 'admin_id';

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
