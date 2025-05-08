<?php

namespace App\Models;

use App\Models\Users\Admin;
use App\Models\Users\Client;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Push extends Model
{
    use HasFactory;


    protected $table = 'push_subscriptions';

    protected $casts = [
        'keys' => 'json',
    ];

    protected $fillable = [
        'endpoint',
        'keys',
        'user_type',
        'user_id'
    ];

    public function user()
    {
        return $this->morphTo('user');
    }

    public function setUser(Admin|Client $user)
    {
        $this->user_type = $user::class;
        $this->user_id = $user->id;
    }

}
