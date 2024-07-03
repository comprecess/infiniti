<?php

namespace App\Models\Catalog;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Traits\CurrencyTrait;

class Cart extends Model
{
    use HasFactory, SoftDeletes, CurrencyTrait;

    public $table = "catalog_cart";

    public static $timeForCart = 60*60*24*30;

    const TYPE = ['priceHour', 'priceDay'];

    public static $taxes = 0.2;

    public function setSecret()
    {
        $str = random_bytes(32);
        $str = base64_encode($str);
        $str = str_replace(["+", "/", "="], "", $str);
        $str = substr($str, 0, 32);
        $this->secret = md5(md5(time()) . $str);
    }

    public function items()
    {
        return $this->hasMany(CartItem::class, 'id_catalog_cart');
    }

    public function calculation()
    {
        $total = $subTax = $subTotal = 0;
//        $rate = Prop::where('id_name', 'rate')->first();
//        $type = $rate->children->push($rate);

        $this->items()->with(['userCatalog'])->get()->each(function($item) use(/*$rate, $type, */&$total, &$subTax, &$subTotal){
//            $user = $item->userCatalog;
//            $values = $user->values()
//                ->whereIn('catalog_prop_value.id_prop', $type->pluck('id'))
//                ->get();
//
//            $idType = $type->where('id_name', $item->name_id_type)->first()->id;
//            $price = (int) $values->where('id_prop', $idType)->first()->value;
//
//            $item->taxes_include = (int) $values->where('id_prop', $rate->id)->count();
//            $item->price = $price;
//            $item->total = $price * $item->amount;
//            $item->save();
            $item->calculation();
            $subTax += (float) $item->getTaxesTotalPrice();
            $subTotal += $item->total;
            $total += !$item->taxes_include ? $item->total + ($item->total * self::$taxes) : $item->total ;
//            $total += $item->getTaxesPrice() * $item->amount ;
        });

        $this->total = $total;
        $this->sub_total = $subTotal;
        $this->sub_tax = $subTax;
        $this->save();

    }
}
