<?php

namespace App\Http\Controllers\Api;

use App\Contracts\FilterBusinessModelContract;
use App\Http\Controllers\Controller;
use App\Http\Requests\BusinessModel\ListRequest;
use App\Http\Resources\BusinessModel\BusinessModelResource;
use App\Http\Resources\Catalog\PropertyResorce;
use App\Http\Resources\Catalog\UsersResorce;
use App\Models\BusinessModel\BusinessModel;
use App\Models\BusinessModel\Prop;
use App\Models\Catalog\User;
use App\Models\BusinessModel\Value;
use Illuminate\Http\Request;


class BusinessModelController extends Controller
{

    public function filters(Request $request)
    {

        $dopFilter = ['specialization'];
        $prop = Prop::whereNull('id_parent')
            ->with(['children', 'values']);

        if($request->prop && in_array($request->prop, $dopFilter)) {
            $prop->where('id_name', $request->prop);
        }else{
            $prop->where('filter', 1);
        }

        return PropertyResorce::collection($prop->get());
    }

    public function properties(Request $request)
    {
        $prop = Prop::whereNull('id_parent')
            ->with(['children', 'values'])
            ->get();

        return PropertyResorce::collection($prop);
    }

    public function property(Request $request)
    {
        $prop = Prop::where('id', $request->route('id'))
            ->orWhere('id_name', $request->route('id'))
            ->first();

        return new PropertyResorce($prop);
    }

    public function list(ListRequest $request, FilterBusinessModelContract $filter)
    {
        $queryBuild = BusinessModel::select(['business_model.*'])->distinct()->with(['values', 'props', 'values.prop']);

        if($request->filter) {
            $filter->properties($request->filter, $queryBuild);
        }

        $sort = $request->getSort();
        $prop = Prop::where('id_name', $sort)->first();

        if($prop) {

            $beforeQuerySort =  Value::selectRaw('business_model_value.id_business_model, business_model_prop_value.value * 1 as value')
                ->leftJoin('business_model_value', function($join){
                    $join->on('business_model_value.cataloggable_id', '=', 'business_model_prop_value.id')
                        ->where('business_model_value.cataloggable_type', '=', Value::class);
                })
                ->where('business_model_prop_value.id_prop', $prop->id)
                ->where('business_model_value.cataloggable_type', '=', Value::class);


            $queryBuild->addSelect(['sortValue.value'])
                ->leftJoinSub($beforeQuerySort, 'sortValue', function($join){
                $join->on('sortValue.id_business_model', '=', 'business_model.id');
            })
                ->orderBy('sortValue.value', $request->getSort(true));
        }else{
            $queryBuild->orderBy("business_model.{$sort}", $request->getSort(true));
        }

        $resultQuery = $queryBuild->paginate($request->getAmount());

        return BusinessModelResource::collection($resultQuery);
    }

    public function item(User $catalogUser)
    {
        return new UsersResorce($catalogUser);
    }

}
