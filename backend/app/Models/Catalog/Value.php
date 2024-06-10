<?php

namespace App\Models\Catalog;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Value extends Model
{
    use HasFactory;

    protected $table = 'catalog_prop_value';
    public $timestamps = false;

    public function users()
    {
        return $this->morphToMany(related: User::class, name: 'cataloggable', table:'catalog_user_value', relatedPivotKey: 'id_catalog_user');
    }

    public function prop()
    {
        return $this->belongsTo(Prop::class, 'id_prop');
    }
}
