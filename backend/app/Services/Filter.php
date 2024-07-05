<?php


namespace App\Services;


use App\Contracts\FilterContract;
use App\Models\Catalog\Prop;
use App\Models\Catalog\User;
use App\Models\Catalog\Value;
use App\Services\Filter\Availability;
use App\Services\Filter\Years;

class Filter implements FilterContract
{
    protected $afterFilterName = [
        'years' => Years::class,
        'availability' => Availability::class
    ];

    protected $similarListProp = [
        'lvl', 'key_skills', 'industries'
    ];

    public function properties(array $data, $query)
    {
        $i = 0;
        $users = [];

        if(!$data) {
            return;
        }

        $FilterQuery = clone $query;

        $FilterQuery->join('catalog_user_value', 'catalog_user_value.id_catalog_user', '=', 'catalog_user.id')
            ->join('catalog_prop_value', function($join){
                $join->on('catalog_prop_value.id', '=', 'catalog_user_value.cataloggable_id')
                    ->where('catalog_user_value.cataloggable_type', '=', Value::class);
            });

        foreach($data as $id => $value) {
            $newQuery = clone $FilterQuery;
            $type = is_int($id) ? 'id' : 'id_name';
            $prop = Prop::where($type, $id)/*->where('filter', 1)*/->with(['children', 'values'])->first();

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
                            $q->whereIn('catalog_prop_value.id', $value)
                                ->where('catalog_prop_value.id_prop', $prop->id);
                        });
                    break;
                    case in_array($prop->type, [Prop::TYPE[1], Prop::TYPE[2]]):
                        $in = [];
                        foreach($value as $v) {
                            if(is_array($v)) {
                                $newQuery->where(function($q) use($v, $prop){
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
                                $newQuery->where(function($q) use($in, $prop){
                                    $q->whereIn('catalog_prop_value.value', $in)
                                        ->where('catalog_prop_value.id_prop', $prop->id);
                                });
                            }
                        }
                    break;
                    case $prop->type == Prop::TYPE[3]:
                        $newQuery->where(function($q) use($value, $prop){
                            $q->where('catalog_prop_value.value', 'like', $value)
                                ->where('catalog_prop_value.id_prop', $prop->id);
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

        $query->whereIn('catalog_user.id', $users ? $users : [0]);

    }

    public function similar(User $user)
    {
        $result = [];
        $values = $user->values()
            ->with(['users'])
            ->join('catalog_prop', 'catalog_prop.id', '=', 'catalog_prop_value.id_prop')
            ->whereIn('catalog_prop.id_name', $this->similarListProp)
            ->orderByRaw('FIELD(catalog_prop.id_name, "'.implode('","', $this->similarListProp).'")')
            ->get();
        foreach($values as $v) {
            foreach($v->users as $u) {
                if(isset($result[$u->id])) {
                    $result[$u->id]++;
                } else {
                    $result[$u->id] = 1;
                }
            }
        }
        unset($result[$user->id]);
        arsort($result);

        return User::whereIn('id', collect($result)->keys()->chunk(3)->first())->get();

    }
}
