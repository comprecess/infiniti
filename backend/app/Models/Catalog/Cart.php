<?php

namespace App\Models\Catalog;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Traits\CurrencyTrait;
use App\Models\User as UserCrm;

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

        $this->items()->with(['userCatalog'])->get()->each(function($item) use(/*$rate, $type, */&$total, &$subTax, &$subTotal){
            $item->calculation();
            $subTax += (float) $item->getTaxesTotalPrice();
            $subTotal += $item->total;
            $total += !$item->taxes_include ? $item->total + ($item->total * self::$taxes) : $item->total ;
        });

        $this->total = $total;
        $this->sub_total = $subTotal;
        $this->sub_tax = $subTax;
        $this->save();

    }

    public static function add(User $userCatalog, $typeProp = self::TYPE[1], $amount = 1)
    {
        if(array_search($typeProp, self::TYPE) === false) {
            throw new \Exception("Wrong type");
        }

        $user = UserCrm::getAuth();
        $cart = $user->myCart;

        if(!$cart) {
            $cart = new Cart();
            $cart->setSecret();
            $cart->user_type = $user::class;
            $cart->user_id = $user->id;
            $cart->save();
        }

        $item = $cart->items()->where('id_catalog_user', $userCatalog->id)->first();

        if($item) {
            if($item->name_id_type == $typeProp) {
                $item->amount = $amount;
            } else {
                $item->name_id_type = $typeProp;
                $item->amount = $amount;
            }
        } else {
            $item = new CartItem();
            $item->id_catalog_cart = $cart->id;
            $item->id_catalog_user = $userCatalog->id;
            $item->name_id_type = $typeProp;
            $item->amount = $amount;
        }
        $item->save();

        $cart->calculation();

        return $cart;
    }
}
