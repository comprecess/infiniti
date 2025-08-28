<?php


namespace App\Models\Traits;


use App\Models\Resident\Orders\Order;

trait OrderTrait
{
    public function toOrder()
    {
        return $this->morphMany(Order::class, 'model')->orderByDesc('id');
    }
}
