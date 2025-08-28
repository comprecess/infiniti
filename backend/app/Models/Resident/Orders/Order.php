<?php

namespace App\Models\Resident\Orders;

use App\Models\Catalog\CartOrder;
use App\Models\Contracts\InsertDefaultValueInterface;
use App\Models\Resident\Invoices\Invoice;
use App\Models\Traits\CurrencyTrait;
use App\Models\Traits\HelperTrait;
use App\Models\Traits\InsertDefaultValueTrait;
use App\Models\Traits\UserTrait;
//use App\Models\Users\Client;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model implements InsertDefaultValueInterface
{
    use HasFactory, UserTrait, InsertDefaultValueTrait, HelperTrait, CurrencyTrait;

    const STATUS = ['Pending', 'Active'];

    protected $table = "sys_orders";

    public $timestamps = false;

    protected $casts = [
        'date_added' => 'date',
    ];

//    public function user()
//    {
//        return $this->belongsTo(Client::class, 'cid');
//    }

    public function model()
    {
        return $this->morphTo('model');
    }

    public function setModel(Model $model)
    {
        $this->model_type = $model::class;
        $this->model_id = $model->id;
    }

    public function getDefault(): array
    {
        $this->setRandomNum('ordernum', 10, true, true);
        return [
            'status' => [self::STATUS[0]],
            'date_added' => [now()],
            'pid' => [0],
            'iid' => [0],
            'billing_cycle' => ['One Time']
        ];
    }

    public static function createByCatalog(CartOrder $modelOrder)
    {
        $modelOrder->load(['model', 'model.client', 'cart', 'cart.getCurrencyIso']);
        $order = self::newDefault();
        $order->setModel($modelOrder);

        $model = $modelOrder->model;

        if($client = $model?->client) {
            $order->cname = $client->account;
            $order->cid = $client->id;
        }

        $order->iid = $model instanceof Invoice ? $model->id : 0;
        $order->amount = $modelOrder->cart->total;
        $order->setCurrency($modelOrder->cart->getCurrencyIso) ;
        $order->save();

        return $order;
    }
}
