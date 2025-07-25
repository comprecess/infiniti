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

    public function valuesExistsPublic()
    {
        return $this->hasMany(Value::class, 'id_prop')
            ->distinct()
            ->select('business_model_prop_value.*')
            ->join('business_model_value', function($join){
                $join->on('business_model_value.cataloggable_id','=','business_model_prop_value.id')
                    ->where('business_model_value.cataloggable_type', Value::class);
            })
            ->join('business_model', 'business_model.id', '=', 'business_model_value.id_business_model')
            ->whereNull('business_model.deleted_at')
//            ->where('business_model.active', 1)
            ->orderBy('business_model_prop_value.value', 'asc');
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
