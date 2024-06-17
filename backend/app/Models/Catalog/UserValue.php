<?php

namespace App\Models\Catalog;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserValue extends Model
{
    use HasFactory;

    protected $table = 'catalog_user_value';
    public $timestamps = false;

}
