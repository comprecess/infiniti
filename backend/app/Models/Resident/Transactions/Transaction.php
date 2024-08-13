<?php

namespace App\Models\Resident\Transactions;

use App\Models\Collection\TransactionCollection;
use App\Models\Traits\CollectionTrait;
use App\Models\Traits\CurrencyTrait;
use App\Models\Users\Client;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory, CurrencyTrait, CollectionTrait;

    protected $table = "sys_transactions";

    protected $collection = TransactionCollection::class;

    protected $casts = [
        'date' => 'date',
    ];

    //Плательщик
    public function payerUser()
    {
        return $this->belongsTo(Client::class, 'payerid');
    }

    //получатель платежа
    public function payeeUser()
    {
        return $this->belongsTo(Client::class, 'payeeid');
    }
}
