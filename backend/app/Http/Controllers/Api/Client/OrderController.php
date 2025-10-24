<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\Client\Order\OrderCatalogListResource;
use App\Http\Resources\Client\Order\OrderListResource;
use App\Http\Resources\Client\Order\OrderResource;
use App\Models\Resident\Orders\Order;
use App\Models\User;
use App\Http\Controllers\Api\Traits\CRUD;


class OrderController extends Controller
{
    use CRUD;

    public function list()
    {
        $user = User::getAuth();
        $query = $user->cart()
            ->with([
                'order',
                'getCurrencyIso',
                'items',
                'businessPlan',
//                'items.userCatalog',
//                'items.userCatalog.values',
//                'items.userCatalog.values.prop',
//                'items.userCatalog.blockExperience',
//                'items.userCatalog.files'
            ])
            ->has('order')
            ->withTrashed();

        return $this->index($query, OrderCatalogListResource::class, true);
//        return $this->index(User::getAuth()->orders()->with(['getCurrencyIso']), OrderListResource::class, true);
    }

    public function item(Order $order)
    {
        $user = User::getAuth();
        if($order->cid != $user->id) {
            abort(404);
        }

        $order->load(['model', 'model.cartOrder', 'model.cartOrder.getCurrencyIso', 'model.cartOrder.items', 'model.cartOrder.items.getCurrencyIso', 'model.cartOrder.items.userCatalog', 'items']);

        return new OrderResource($order);
    }


}
