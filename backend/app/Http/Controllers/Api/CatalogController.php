<?php

namespace App\Http\Controllers\Api;

use App\Contracts\FilterContract;
use App\Events\User\CreateOrder;
use App\Http\Controllers\Api\Resident\Sale\OfferController;
use App\Http\Controllers\Controller;
use App\Http\Requests\Catalog\CartRequest;
use App\Http\Requests\Catalog\EmploymentRequest;
use App\Http\Requests\Catalog\ListRequest;
use App\Http\Requests\MeetingRequest;
use App\Http\Resources\Catalog\CartResorce;
use App\Http\Resources\Catalog\PropertyFilterResource;
use App\Http\Resources\Catalog\PropertyResorce;
use App\Http\Resources\Catalog\UsersResorce;
use App\Models\Catalog\Cart;
use App\Models\Catalog\Prop;
use App\Models\Catalog\User;
use App\Models\Catalog\Value;
use App\Models\Resident\Invoices\Invoice;
use App\Models\Resident\Invoices\Offer;
use App\Models\Users\Admin;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\User as UserCrm;
use Stripe\StripeClient;


class CatalogController extends Controller
{

    public function filters(Request $request)
    {
        $dopFilter = ['specialization'];
        $prop = Prop::whereNull('id_parent')
            ->with(['children', 'valuesExistsPublic']);

        if($request->prop && in_array($request->prop, $dopFilter)) {
            $prop->where('id_name', $request->prop);
        }else{
            $prop->where('filter', 1);
        }

        return PropertyFilterResource::collection($prop->get());
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
        $queryBuild = User::select(['catalog_user.*'])
            ->distinct()
            ->with(['blockExperience', 'values', 'props', 'values.prop'])
            ->where('active', 1);

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

    public function employment(EmploymentRequest $request)
    {
        $usersData = [];
        $model = User::with(['employmentNow']);
        if($request->ids) {
            $model->whereIn('id', $request->ids);
        }

        foreach ($model->get() as $user) {
            foreach($user->employmentNow()->orderBy('from', 'asc')->get() as $employment) {
                if($request->timezone) {
                    $usersData[$user->id][] = [
                        'from' => $employment->from->setTimezone($request->timezone)->format(MeetingRequest::FORMAT_DATE),
                        'to' => $employment->to->setTimezone($request->timezone)->format(MeetingRequest::FORMAT_DATE),
                    ];
                } else {
                    $usersData[$user->id][] = [
                        'from' => $employment->from->format(MeetingRequest::FORMAT_DATE),
                        'to' => $employment->to->format(MeetingRequest::FORMAT_DATE),
                    ];
                }
            }
        }

        return response()->json(['data' => $usersData]);
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

    public function createPay()
    {
        $user = UserCrm::getAuth();
        $cart = $user?->myCart;
        if(!$cart && floatval($cart?->total) == 0 && $user instanceof Admin) {
            return response()->json(['message' => 'Cart not found'], 203);
        }


        $offer = Offer::createCart($cart);
        $offerController = new OfferController();
        /**
         * @var JsonResponse  $response
         */
        $response = $offerController->convert($offer);
        $invoiceId = $response->getData()->invoiceId;
        $invoice = Invoice::find($invoiceId);

        $invoice->subtotal = $cart->sub_total;
        $invoice->tax = $cart->sub_tax;
        $invoice->total = $cart->total;
        $invoice->save();

        $cart->createOrder($invoice, false);
        event(new CreateOrder($invoice));


        return response()->json(['success' => true, 'token' => $invoice->vtoken]);
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
