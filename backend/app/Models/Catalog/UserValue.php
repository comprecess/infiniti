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

    public static function queryBuild(string|Builder $class) :Builder
    {
        if(is_string($class)) {
            $name = $class;
            $class = $class::select('*');
        } else if($class instanceof Builder) {
            $name = get_class($class->getModel());
        }
        dd($name);
    }
}
