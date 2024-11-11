<?php

namespace App\Models\Catalog;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartOrder extends Model
{
    use HasFactory;

    public $table = "catalog_cart_order";

    public $timestamps = false;

    protected $fillable = [
        'id_catalog_cart',
        'to_id',
    ];

    public function model()
    {
        return $this->morphTo('to');
    }

    public function cart()
    {
        return $this->belongsTo(Cart::class, 'id_catalog_cart');
    }

}
