<?php

namespace App\Models\Catalog;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserBlock extends Model
{
    use HasFactory;

    protected $table = 'catalog_user_block';
    public $timestamps = false;

    protected $casts = [
        'from' => 'datetime',
        'to' => 'datetime',
    ];
}
