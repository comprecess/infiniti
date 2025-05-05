<?php

namespace App\Models\Resident\Transactions;

use App\Models\Traits\CurrencyTrait;
use App\Models\Traits\UserTrait;
use App\Models\Users\Client;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bill extends Model
{
    use HasFactory, CurrencyTrait, UserTrait;

    const RECURRING_TYPE = ['Monthly', 'Yearly'];

    protected $currencyColumnName = 'currency';
    protected $clientColumn = 'contact_id';

    protected $casts = [
        'next_date' => 'date',
    ];

    public function account()
    {
        return $this->belongsTo(Account::class, 'from_account_id');
    }

    public function client()
    {
        return $this->belongsTo(Client::class, 'contact_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }


}
