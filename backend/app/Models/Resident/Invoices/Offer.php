<?php

namespace App\Models\Resident\Invoices;

use App\Models\Traits\CurrencyTrait;
use App\Models\Traits\HelperTrait;
use App\Models\Users\Client;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Offer extends Model
{
    use HasFactory, CurrencyTrait, HelperTrait;

    const STAGE = ['Accepted', 'Dead', 'Delivered', 'Draft', 'Lost'];

    public $currencyId = true;

    protected $table = "sys_quotes";

    public $timestamps = false;

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

    public function items()
    {
        return $this->morphMany(InvoiceItem::class, 'document');
    }

}
