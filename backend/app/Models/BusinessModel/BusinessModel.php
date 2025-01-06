<?php

namespace App\Models\BusinessModel;

use App\Models\Traits\CurrencyTrait;
use App\Models\Traits\FileStorageTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BusinessModel extends Model
{
    use HasFactory, CurrencyTrait, SoftDeletes, FileStorageTrait;

    const TYPE_IMG = ['preview', 'content'];

    protected $table = 'business_model';

    public $timestamps = false;

    protected $casts = [
        'start' => 'date',
    ];

    public function values()
    {
        return $this->morphedByMany(related: Value::class, name: 'cataloggable', table:'business_model_value', foreignPivotKey: 'id_business_model');
    }

    public function props()
    {
        return $this->morphedByMany(related: Prop::class, name: 'cataloggable', table:'business_model_value', foreignPivotKey: 'id_business_model');
    }

    public function getPropsByNameId(array $nameId = null)
    {
        $values = $this->values->load(['prop']);

        $props = $values->pluck('prop')->unique('id')->map(function($item) use ($values){
            $item->values = collect($values->where('id_prop', $item->id)->sortBy('id')->all());
            return $item;
        });

        if($nameId) {
            $props = $props->whereIn('id_name', $nameId);
        }

        return $props;
    }

    public function setPropData($value, $idNameProp)
    {
        $ids = collect([]);
        $prop = Prop::where(intval($idNameProp) == $idNameProp ? 'id' : 'id_name', $idNameProp)->first();
        if(!$prop) {
            return false;
        }

        $prop->childrenList($ids);

        $isInt = intval($value) == $value;

        $valueQuery = Value::whereIn('id_prop', $ids->pluck('id'));

        if($isInt && !in_array($prop->type, ['integer'])) {
            $valueQuery->where('id', $value);
        }else{
            $valueQuery->where('value', $value);
        }

        $val = $valueQuery->first();

        if($val) {
            $this->values()->attach([$val->id]);
        } else {
            if(!$prop->has_add) {
                throw new \Exception("Properties [{$prop->id_name}] are not allowed to be added");
            }
            $prop->values()->create(['value' => $value])->users()->attach([$this->id]);
        }

    }


}
