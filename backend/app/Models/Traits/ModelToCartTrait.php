<?php


namespace App\Models\Traits;


use App\Models\Catalog\Cart;
use App\Models\Catalog\CartOrder;

trait ModelToCartTrait
{
    public function orderCart()
    {
        return $this->morphToMany(Cart::class, 'model', CartOrder::class, null, 'id_catalog_cart');
    }

    public function order()
    {
        return $this->morphMany(CartOrder::class, 'model')->with(['cart']);
    }
}
