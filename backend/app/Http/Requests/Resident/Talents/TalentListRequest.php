<?php

namespace App\Http\Requests\Resident\Talents;

use App\Http\Requests\Resident\DocumentRequest;
use App\Models\Catalog\Value;
use Illuminate\Support\Facades\DB;


class TalentListRequest extends DocumentRequest
{
    public function sort() :array
    {
        return [
            'id' => 'catalog_user.id',
            'name' => 'name',
            'specialization' => 'sortProp',
            'lvl' => 'sortProp',
            'priceHour' => 'sortProp',
            'priceDay' => 'sortProp',
        ];
    }

    public function sortProp($query)
    {
        $name = $this->sort['name'];
        $desc = isset($this->sort['type']) ? (bool) $this->sort['type'] : true;
        $propIdsQuery = DB::table('catalog_prop_value')
            ->leftJoin('catalog_user_value', function($join){
                $join->on('catalog_user_value.cataloggable_id', '=', 'catalog_prop_value.id')
                    ->where('catalog_user_value.cataloggable_type', Value::class);
            })
            ->select(['catalog_user_value.id_catalog_user'])
            ->whereNotNull('catalog_user_value.cataloggable_id')
            ->whereRaw('catalog_prop_value.id_prop = (SELECT catalog_prop.id FROM catalog_prop WHERE catalog_prop.id_name = \''.$name.'\')');
        if(in_array($name, ['priceHour', 'priceDay'])) {
            $propIdsQuery->orderBy(DB::raw('(catalog_prop_value.value * 1)'), $desc ? "desc" : 'asc');
        }else{
            $propIdsQuery->orderBy('catalog_prop_value.value', $desc ? "desc" : 'asc');
        }
        $listSort = $propIdsQuery->get()->pluck('id_catalog_user');
        if($listSort->count()) {
            $query->orderByRaw('FIELD(`catalog_user`.`id`, \''.$listSort->implode("','").'\')');
        }
    }

}
