<?php

namespace App\Models\BusinessModel;

use App\Models\Catalog\Prop as PropCatalog;

class Prop extends PropCatalog
{

    protected $table = 'business_model_prop';

    public function users()
    {
        return null;
    }

    public function values()
    {
        return $this->hasMany(Value::class, 'id_prop');
    }

    public function model()
    {
        return $this->morphToMany(related: BusinessModel::class, name: 'cataloggable', table:'business_model_value', relatedPivotKey: 'id_business_model');
    }

}
