<?php

namespace App\Models\Resident\Client;

use App\Models\Traits\UserTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasFactory, UserTrait;

    protected $table = "sys_activity";

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'no_delete' => 'boolean'
    ];

    public function scopeActive($query, $active = true) :void
    {
        if($active) {
            $query->where(function($q){
                $q->where('no_delete', 0)
                    ->orWhereNull('no_delete');
            });
        }else{
            $query->where('no_delete', 1);
        }
    }
}
