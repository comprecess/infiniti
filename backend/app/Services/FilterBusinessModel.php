<?php


namespace App\Services;


use App\Contracts\FilterBusinessModelContract;
use App\Models\BusinessModel\Prop;
use App\Models\BusinessModel\Value;

class FilterBusinessModel implements FilterBusinessModelContract
{
    protected $afterFilterName = [

    ];

    public function properties(array $data, $query)
    {
        $i = 0;
        $users = [];

        if(!$data) {
            return;
        }

        $FilterQuery = clone $query;

        $FilterQuery->join('business_model_value', 'business_model_value.id_business_model', '=', 'business_model.id')
            ->join('business_model_prop_value', function($join){
                $join->on('business_model_prop_value.id', '=', 'business_model_value.cataloggable_id')
                    ->where('business_model_value.cataloggable_type', '=', Value::class);
            });


        foreach($data as $id => $value) {
            $newQuery = clone $FilterQuery;
            $type = is_int($id) ? 'id' : 'id_name';
            $prop = Prop::where($type, $id)/*->where('filter', 1)*/->with(['children', 'values'])->first();

            $method = $id.'Filter';
            if(!$prop && method_exists($this, $method)) {
                $this->{$method}($query, $value);
            }

            if(!$prop || !$prop?->type || !is_array($value)) {
                continue;
            }

            #afterFilter
            if(isset($this->afterFilterName[$prop->id_name])) {
                $class = $this->afterFilterName[$prop->id_name];
                $object = new $class($newQuery, $prop);
                $object->before($value);
            } else {

                switch (true) {
                    case in_array($prop->type, [Prop::TYPE[0], Prop::TYPE[4], Prop::TYPE[5]], ):
                        $newQuery->where(function($q) use($value, $prop){
                            $q->whereIn('business_model_prop_value.id', $value)
                                ->where('business_model_prop_value.id_prop', $prop->id);
                        });
                    break;
                    case in_array($prop->type, [Prop::TYPE[1], Prop::TYPE[2]]):
                        $in = [];
                        foreach($value as $v) {
                            if(is_array($v)) {
                                $newQuery->where(function($q) use($v, $prop){
                                    $q->where('business_model_prop_value.id_prop', $prop->id);

                                    if(isset($v[0]) && $v[0] !== null) {
                                        $q->where('business_model_prop_value.value', '>=', $v[0]);
                                    }

                                    if(isset($v[1]) && $v[1] !== null) {
                                        $q->where('business_model_prop_value.value', '<=', $v[1]);
                                    }
                                });
                            } else {
                                $in[] = $v;
                            }

                            if($in) {
                                $newQuery->where(function($q) use($in, $prop){
                                    $q->whereIn('business_model_prop_value.value', $in)
                                        ->where('business_model_prop_value.id_prop', $prop->id);
                                });
                            }
                        }
                    break;
                    case $prop->type == Prop::TYPE[3]:
                        $newQuery->where(function($q) use($value, $prop){
                            $q->where('business_model_prop_value.value', 'like', $value)
                                ->where('business_model_prop_value.id_prop', $prop->id);
                        });
                    break;
                }
            }

            if($i == 0) {
                $users = $newQuery->get()->pluck('id')->toArray();
            } else {
                $users = array_intersect($users, $newQuery->get()->pluck('id')->toArray());
            }

            $i++;
        }

        $query->whereIn('business_model.id', $users ? $users : [0]);

    }

    private function dateFilter($query, $value)
    {

    }
}
