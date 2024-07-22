<?php

namespace App\Models\Resident\Orders;

use App\Models\Users\Client;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $table = "sys_orders";

    protected $casts = [
        'date_added' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(Client::class, 'cid');
    }
}
