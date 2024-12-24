<?php

namespace App\Models\BusinessModel;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Value extends Model
{
    use HasFactory;

    protected $table = 'business_model_prop_value';
    public $timestamps = false;

    protected $fillable = [
        'value'
    ];

    public function users()
    {
        return $this->morphToMany(related: BusinessModel::class, name: 'cataloggable', table:'business_model_value', relatedPivotKey: 'id_business_model');
    }

    public function prop()
    {
        return $this->belongsTo(Prop::class, 'id_prop');
    }
}
