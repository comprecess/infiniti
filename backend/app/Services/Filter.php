<?php


namespace App\Services;


use App\Contracts\FilterContract;
use App\Models\Catalog\Prop;

class Filter implements FilterContract
{
    protected $propertyAfterFilter = [];
    protected $afterFilterName = ['years'];

    public function propertis(array $data, $query)
    {
        foreach($data as $id => $value) {
            $type = is_int($id) ? 'id' : 'id_name';
            $prop = Prop::where($type, $id)->with(['children', 'values'])->first();

            if(!$prop || !$prop?->type || !is_array($value)) {
                continue;
            }

            #afterFilter
            if(in_array($prop->id_name, $this->afterFilterName)) {
                $this->propertyAfterFilter[$prop->id_name] = $prop;
                continue;
            }

            switch ($prop->type) {
                case 'checkbox':
                    $query->where(function($q) use($value, $prop){
                        $q->whereIn('catalog_prop_value.id', $value)
                            ->where('catalog_prop_value.id_prop', $prop->id);
                    });
                    break;
                case 'integer':
                case 'double':
                    $in = [];
                    foreach($value as $v) {
                        if(is_array($v)) {
                            $query->where(function($q) use($v, $prop){
                                $q->where('catalog_prop_value.id_prop', $prop->id);

                                if(isset($v[0]) && $v[0] !== null) {
                                    $q->where('catalog_prop_value.value', '>=', $v[0]);
                                }

                                if(isset($v[1]) && $v[1] !== null) {
                                    $q->where('catalog_prop_value.value', '<=', $v[1]);
                                }
                            });
                        } else {
                            $in[] = $v;
                        }

                        if($in) {
                            $query->where(function($q) use($in, $prop){
                                $q->whereIn('catalog_prop_value.value', $in)
                                    ->where('catalog_prop_value.id_prop', $prop->id);
                            });
                        }
                    }
                    break;

                    break;
                case 'string':

                    break;
            }



        }

    }

    public function afterFilter()
    {

    }
}
