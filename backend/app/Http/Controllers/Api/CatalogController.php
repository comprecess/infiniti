<?php

namespace App\Http\Controllers\Api;

use App\Contracts\FilterContract;
use App\Http\Controllers\Controller;
use App\Http\Requests\Catalog\CartRequest;
use App\Http\Requests\Catalog\ListRequest;
use App\Http\Resources\Catalog\CartResorce;
use App\Http\Resources\Catalog\PropertyResorce;
use App\Http\Resources\Catalog\UsersResorce;
use App\Models\Catalog\Cart;
use App\Models\Catalog\Prop;
use App\Models\Catalog\User;
use App\Models\Catalog\Value;
use Illuminate\Http\Request;
use App\Models\User as UserCrm;


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
        $queryBuild = User::select(['catalog_user.*'])->distinct()->with(['blockExperience', 'values', 'props', 'values.prop']);

        if($request->filter) {
            $filter->properties($request->filter, $queryBuild);
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

        return UsersResorce::collection($resultQuery);
    }

    public function item(User $catalogUser)
    {
        return new UsersResorce($catalogUser);
    }

    public function addCart(CartRequest $request)
    {
        try{
            $userCatalog = User::findOrFail($request->catalogUser);
            Cart::add($userCatalog, $request->type, $request->amount);
        }catch (\Exception $e) {
            return response()->json(['success' => false]);
        }

        return response()->json(['success' => true]);
    }

    public function getCart()
    {
        return new CartResorce(UserCrm::getAuth()->myCart ?? new Cart());
    }

    public function deleteItemCart(Request $request)
    {
        $id = $request->route('id');
        $cart = UserCrm::getAuth()?->myCart;
        $cartItem = $cart?->items?->where('id', $id)?->first();
        if($cartItem) {
            $cartItem->delete();
            $cart->calculation();

            return response()->json(['success' => true]);
        } else {
            return response()->json(['success' => false]);
        }
    }

}
