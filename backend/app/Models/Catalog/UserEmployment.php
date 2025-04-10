<?php

namespace App\Models\Catalog;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserEmployment extends Model
{
    use HasFactory;

    protected $table = 'catalog_user_employment';

    public $timestamps = false;

    protected $casts = [
        'from' => 'datetime',
        'to' => 'datetime',
    ];

    public function model()
    {
        return $this->morphTo('model');
    }

}
