<?php

namespace App\Models\Resident\Invoices;

use App\Models\Resident\Settings\Currency;
use App\Models\Traits\CurrencyTrait;
use App\Models\Users\Client;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Offer extends Model
{
    use HasFactory, CurrencyTrait;

    public $currencyId = true;

    protected $table = "sys_quotes";

    protected $casts = [
        'datecreated' => 'date',
        'validuntil' => 'date',
    ];

    public function getCode()
    {
        return $this->invoicenum . ($this->cn ?? $this->id);
    }

    public function user()
    {
        return $this->belongsTo(Client::class, 'userid');
    }

}
