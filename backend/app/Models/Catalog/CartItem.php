<?php

namespace App\Models\Catalog;

use App\Models\Resident\BusinessPlan;
use App\Models\Traits\CurrencyTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory, CurrencyTrait;

    public $table = "catalog_cart_item";

    public static $caclData = null;

    public function userCatalog()
    {
        return $this->belongsTo(User::class, 'id_catalog_user');
    }

    public function cart()
    {
        return $this->belongsTo(Cart::class, 'id_catalog_cart');
    }

    public function businessPlan()
    {
        return $this->belongsTo(BusinessPlan::class, 'business_plan_id');
    }

    public static function getCalcData()
    {
        if(self::$caclData === null) {
            $rate = Prop::where('id_name', 'rate')->first();
            $type = $rate->children->push($rate);
            self::$caclData = [$rate, $type];
        }

        return self::$caclData;
    }

    public function calculation()
    {
        list($rate, $type) = self::getCalcData();

        $user = $this->userCatalog;
        $values = $user->values()
            ->whereIn('catalog_prop_value.id_prop', $type->pluck('id'))
            ->get();

        $idType = $type->where('id_name', $this->name_id_type)->first()->id;
        $price = (int) $values->where('id_prop', $idType)->first()->value;

        $this->taxes_include = (int) $values->where('id_prop', $rate->id)->count();
        $this->price = $price;
        $this->total = $price * $this->amount;
        $this->save();
    }

    public function getTaxesTotalPrice()
    {
        return  !$this->taxes_include ? Cart::getTax()?->getTaxPrice($this->total) ?? 0 : null ;
    }

    public function getTypeBusinessPlan()
    {
        $bp = $this->businessPlan;
        return $bp ? __('catalog.cart.businessPlan.type.model', ['name' => $bp->company_name]) :  __('catalog.cart.businessPlan.type.individual');
    }
}
