<?php

namespace App\Http\Requests\Resident\BusinessPlan;

use App\Http\Requests\Resident\DocumentRequest;
use App\Models\BusinessModel\Value;
use Illuminate\Support\Facades\DB;


class BusinessModelListRequest extends DocumentRequest
{
    public function sort() :array
    {
        return [
            'id' => 'business_model.id',
            'title' => 'business_model.title',
            'technologies' => 'sortProp',
            'location' => 'sortProp',
            'price' => 'sortProp',
        ];
    }

    public function sortProp($query)
    {
        $name = $this->sort['name'];
        $desc = isset($this->sort['type']) ? (bool) $this->sort['type'] : true;
        $propIdsQuery = DB::table('business_model_prop_value')
            ->leftJoin('business_model_value', function($join){
                $join->on('business_model_value.cataloggable_id', '=', 'business_model_prop_value.id')
                    ->where('business_model_value.cataloggable_type', Value::class);
            })
            ->select(['business_model_value.id_business_model'])
            ->whereNotNull('business_model_value.cataloggable_id')
            ->whereRaw('business_model_prop_value.id_prop = (SELECT business_model_prop.id FROM business_model_prop WHERE business_model_prop.id_name = \''.$name.'\')');
        if(in_array($name, ['price'])) {
            $propIdsQuery->orderBy(DB::raw('(business_model_prop_value.value * 1)'), $desc ? "desc" : 'asc');
        }else{
            $propIdsQuery->orderBy('business_model_prop_value.value', $desc ? "desc" : 'asc');
        }
        $listSort = $propIdsQuery->get()->pluck('id_business_model');
        if($listSort->count()) {
            $query->orderByRaw('FIELD(`business_model`.`id`, \''.$listSort->implode("','").'\')');
        }
    }

}
