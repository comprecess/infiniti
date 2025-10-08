<?php

namespace App\Models\Resident\Orders;

use App\Models\Traits\CurrencyTrait;
use App\Models\Traits\UserTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory, UserTrait, CurrencyTrait;

    const STATUS = ['Pending', 'Active'];

    protected $table = "order_items";

    public $timestamps = false;

    public $clientColumn = 'customer_id';

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

}
