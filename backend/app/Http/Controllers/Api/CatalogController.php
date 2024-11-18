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
use Stripe\StripeClient;


class CatalogController extends Controller
{

    public function filters(Request $request)
    {
        $dopFilter = ['categories'];
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

        $cart = \App\Models\User::getAuth()->myCart;
        if($cart) {
            $items = $cart->items;
            $resultQuery->each(function ($item) use($items) {
                $item->inCart = $items?->where('id_catalog_user', $item->id)->count();
            });
        }

        return UsersResorce::collection($resultQuery);
    }

    public function item(User $catalogUser)
    {
        $cart = \App\Models\User::getAuth()->myCart;
        if($cart) {
            $items = $cart->items;
            $catalogUser->inCart = $items?->where('id_catalog_user', $catalogUser->id)->count();
        }
        return new UsersResorce($catalogUser);
    }

    public function addCart(CartRequest $request)
    {
        try{
            $userCatalog = User::findOrFail($request->catalogUser);
            Cart::add($userCatalog, $request->type ?? Cart::TYPE[0], $request->amount ?? 1);
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

    public function pay()
    {
        $stripe = new StripeClient('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

//        $result = $stripe->paymentIntents->create([
//            'amount' => 1099,
//            'currency' => 'usd',
//            'automatic_payment_methods' => ['enabled' => true]
//        ]);
//
//        dd($result);

//        dd($stripe->paymentIntents->all());

        $result = $stripe->charges->create([
            'amount' => 1099,
            'currency' => 'usd',
            'source' => 'tok_visa',
        ]);
        dd($result);
    }

}
