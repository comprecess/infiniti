<?php

namespace App\Models\Catalog;

use App\Models\Contracts\MeetingContract;
use App\Models\Resident\BusinessPlan;
use App\Models\Resident\Invoices\Offer;
use App\Models\Resident\Orders\Order;
use App\Models\Resident\Settings\Currency;
use App\Models\Resident\Settings\Tax;
use App\Models\Traits\ModelToCartTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Traits\CurrencyTrait;
use App\Models\User as UserCrm;

class Cart extends Model implements MeetingContract
{
    use HasFactory, SoftDeletes, CurrencyTrait;

    public $table = "catalog_cart";

    public static $timeForCart = 60*60*24*30;

    const TYPE = ['priceHour', 'priceDay'];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public static function getTax()
    {
        return Tax::where('catalog_default', 1)->first();
    }

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

    public function itemsActive()
    {
        return $this->hasMany(CartItem::class, 'id_catalog_cart')
            ->select('catalog_cart_item.*')
            ->leftJoin('catalog_user', 'catalog_user.id', '=', 'catalog_cart_item.id_catalog_user')
            ->whereNull('catalog_user.deleted_at');
    }

    public function user()
    {
//        if(!$this->user_type || !$this->user_id) {
//            return null;
//        }
        return $this->morphTo('user');
    }

    public function order()
    {
//        return $this->hasMany(CartOrder::class, 'id_catalog_cart')->with(['model']);
        return $this->hasOne(CartOrder::class, 'id_catalog_cart')->with(['model']);
    }

    public function offerOrder()
    {
        return $this->morphedByMany(Offer::class, 'model', CartOrder::class, 'id_catalog_cart');
    }

    public function businessPlan()
    {
        return $this->belongsTo(BusinessPlan::class, 'business_plan_id');
    }

    public function calculation($skipActualPriceUser = false)
    {
        $total = $subTax = $subTotal = 0;

        $this->itemsActive()->with(['userCatalog'])->get()->each(function($item) use(&$total, &$subTax, &$subTotal, $skipActualPriceUser){
            if(!$skipActualPriceUser) {
                $item->calculation();
            }
            $subTax += (float) $item->getTaxesTotalPrice();
            $subTotal += $item->total;
            $total += !$item->taxes_include ? $item->total + (self::getTax()?->getTaxPrice($item->total) ?? 0) : $item->total ;
        });

        $this->total = $total;
        $this->sub_total = $subTotal;
        $this->sub_tax = $subTax;
        $this->save();
        return $this;
    }

    public static function add(User $userCatalog, $typeProp = self::TYPE[1], $amount = 1)
    {
        if(array_search($typeProp, self::TYPE) === false) {
            throw new \Exception("Wrong type");
        }

        $user = UserCrm::getAuth();
        $cart = $user->myCart;
        $currency = Currency::getDefault()->iso_code;

        if(!$cart) {
            $cart = new Cart();
            $cart->setSecret();
            $cart->user_type = $user::class;
            $cart->user_id = $user->id;
            $cart->currency_iso_code = $currency;
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
        $item->currency_iso_code = $currency;
        $item->save();

        $cart->calculation();

        return $cart;
    }

    public function createOrder(Model $model, $duplicate = true)
    {
        if(!method_exists($model, 'order')) {
            throw new \Exception('The class is missing a "order" method. Use a trait: '. ModelToCartTrait::class);
        }
        if($duplicate) {
            $new = $this->replicate();
            $new->setSecret();
            $new->save();

            $this->items->each(function($item) use($new){
                $newItem = $item->replicate();
                $newItem->id_catalog_cart = $new->id;
                $newItem->save();
            });
        } else {
            $new = $this;
        }

        $orderCatalog = $model->order()->create(['id_catalog_cart' => $new->id]);
        Order::createByCatalog($orderCatalog);
        $new->delete();

        return $new;
    }
    public function getUsersCatalog()
    {
        $users = collect([]);
        $items = $this->items()->with(['userCatalog', 'userCatalog.employmentNow'])->get();
        $items->each(function($item) use($users){
            $users->push($item->userCatalog);
        });

        return $users;
    }

    public function getUsersToMeeting(): array
    {
        $users = $this->getUsersCatalog();
        return $users->pluck('name','email')->toArray();
    }

    public function getTitleToMeeting() :?string
    {
        return __('meeting.cart');
    }

    public function getDescriptionToMeeting() :?string
    {
        return __('meeting.cart');
    }

    public function getNameRoomToMeeting(): ?string
    {
        return "cart-" . $this->id;
    }
}
