<?php

namespace App\Models\Catalog;

use App\Models\Traits\OrderTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartOrder extends Model
{
    use HasFactory, OrderTrait;

    public $table = "catalog_cart_order";

    public $timestamps = false;

    protected $fillable = [
        'id_catalog_cart',
        'to_id',
    ];

    public function model()
    {
        return $this->morphTo('model');
    }

    public function cart()
    {
        return $this->belongsTo(Cart::class, 'id_catalog_cart');
    }

    public function cartOrder()
    {
        return $this->belongsTo(Cart::class, 'id_catalog_cart')->withTrashed();
    }

}
