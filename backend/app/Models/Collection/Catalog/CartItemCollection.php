<?php


namespace App\Models\Collection\Catalog;


use App\Models\Catalog\CartItem;
use Illuminate\Database\Eloquent\Collection;

class CartItemCollection extends Collection
{
    public function getJobInHours()
    {

    }

    public function getJobInDays()
    {
        $collect = collect([]);
        $this->each(function($item) use($collect){
            if($item->name_id_type == CartItem::ID_TYPE[0]) {
                $item->amount = ceil($item->amount / 8);
            }
            $collect->push($item->amount);
        });

        return $collect;
    }
}
