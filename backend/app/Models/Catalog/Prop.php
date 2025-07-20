<?php

namespace App\Models\Catalog;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Prop extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'catalog_prop';
    public $timestamps = false;

    const TYPE = [
      'checkbox',
      'integer',
      'double',
      'string',
      'checkboxOnlyForValue',
      'checkboxIndeterminate',
      'date'
    ];

    protected $fillable = [
        'id_name',
        'name',
        'type',
        'lvl',
        'has_add'
    ];

    protected $casts = [
        'options' => 'json',
    ];

    protected $dates = ['deleted_at'];

    public function values()
    {
        return $this->hasMany(Value::class, 'id_prop');
    }

    public function valuesExistsPublic()
    {
        return $this->hasMany(Value::class, 'id_prop')
            ->distinct()
            ->select('catalog_prop_value.*')
            ->join('catalog_user_value', function($join){
                $join->on('catalog_user_value.cataloggable_id','=','catalog_prop_value.id')
                    ->where('catalog_user_value.cataloggable_type', Value::class);
            })
            ->join('catalog_user', 'catalog_user.id', '=', 'catalog_user_value.id_catalog_user')
            ->whereNull('catalog_user.deleted_at')
            ->where('catalog_user.active', 1)
            ->orderBy('catalog_prop_value.value', 'asc');
    }

    public function children()
    {
        return $this->hasMany($this::class, 'id_parent');
    }

    public function parent()
    {
        return $this->belongsTo($this::class, 'id_parent');
    }

    public function users()
    {
        return $this->morphToMany(related: User::class, name: 'cataloggable', table:'catalog_user_value', relatedPivotKey: 'id_catalog_user');
    }


    public function setChildTree(Prop $prop)
    {
        if(!$this->childTree) {
            $this->childTree = collect([]);
        }
        $this->childTree->put($prop->id, $prop);
    }

    public function setValueTree(Value $value)
    {
        if(!$this->valueTree) {
            $this->valueTree = collect([]);
        }
        $this->valueTree->put($value->id, $value);
    }

    public function childrenList(&$data = [])
    {
        if(is_array($data)) {
            $data[] = $this;
        }else{
            $data->push($this);
        }
        $childrens = $this->children;
        foreach($childrens as $children){
            $children->childrenList($data);
        }
    }
}
