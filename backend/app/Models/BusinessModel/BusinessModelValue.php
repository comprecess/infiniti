<?php

namespace App\Models\Catalog;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessModelValue extends Model
{
    use HasFactory;

    protected $table = 'business_model_value';
    public $timestamps = false;

}
