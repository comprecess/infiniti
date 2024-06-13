<?php

namespace App\Http\Controllers\Api;

use App\Contracts\FilterContract;
use App\Http\Controllers\Controller;
use App\Http\Requests\Catalog\ListRequest;
use App\Http\Resources\Catalog\PropertyResorce;
use App\Http\Resources\Catalog\UserResorce;
use App\Models\Catalog\Prop;
use App\Models\Catalog\User;
use App\Models\Catalog\UserValue;
use App\Models\Catalog\Value;
use Illuminate\Http\Request;


class CatalogController extends Controller
{

    public function filters(Request $request)
    {
        $prop = Prop::whereNull('id_parent')
            ->where('filter', 1)
            ->with(['children', 'values'])
            ->get();

        return PropertyResorce::collection($prop);
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

    public function list(ListRequest $request, FilterContract $filter)
    {
        $queryBuild = User::select(['catalog_user.*'])->distinct()->with(['user', 'blockExperience', 'values', 'props']);

        if($request->propertyValue) {
            $queryBuild->join('catalog_user_value as t1', 't1.id_catalog_user', '=', 'catalog_user.id')
                ->join('catalog_prop_value as t1_1', function($join){
                    $join->on('t1_1.id', '=', 't1.cataloggable_id')
                        ->where('t1.cataloggable_type', '=', Value::class);
                })
                ->whereIn('t1_1.id', $request->propertyValue);
        }

//        dd($filter->);

        if($request->property) {
            $queryBuild->join('catalog_user_value as t2', 't2.id_catalog_user', '=', 'catalog_user.id')
                ->join('catalog_prop_value as t2_2', function($join){
                    $join->on('t2_2.id', '=', 't2.cataloggable_id')
                        ->where('t2.cataloggable_type', '=', Value::class);
                })
                ->whereIn('t2_2.id', $request->propertyValue);
        }

        $sort = $request->getSort();

        $prop = Prop::where('id_name', $sort)->first();
        if($prop) {

            $beforeQuerySort =  Value::selectRaw('catalog_user_value.id_catalog_user, catalog_prop_value.value * 1 as value')
                ->leftJoin('catalog_user_value', function($join){
                    $join->on('catalog_user_value.cataloggable_id', '=', 'catalog_prop_value.id')
                        ->where('catalog_user_value.cataloggable_type', '=', Value::class);
                })
                ->where('catalog_prop_value.id_prop', $prop->id)
                ->where('catalog_user_value.cataloggable_type', '=', Value::class);


            $queryBuild->addSelect(['sortValue.value'])
                ->leftJoinSub($beforeQuerySort, 'sortValue', function($join){
                $join->on('sortValue.id_catalog_user', '=', 'catalog_user.id');
            })
                ->orderBy('sortValue.value', $request->getSort(true));
        }

        $resultQuery = $queryBuild->paginate($request->getAmount());

        return UserResorce::collection($resultQuery);
    }

    public function item(User $catalogUser)
    {
        return new UserResorce($catalogUser);
    }
}
