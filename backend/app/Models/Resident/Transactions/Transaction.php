<?php

namespace App\Models\Resident\Transactions;

use App\Models\Traits\CurrencyTrait;
use App\Models\Users\Client;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory, CurrencyTrait;

    protected $table = "sys_transactions";

    protected $casts = [
        'date' => 'date',
    ];

    //Плательщик
    public function payer()
    {
        return $this->belongsTo(Client::class, 'payerid');
    }

    //получатель платежа
    public function payee()
    {
        return $this->belongsTo(Client::class, 'payeeid');
    }
}
