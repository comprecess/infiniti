<?php

namespace App\Models\Resident\Invoices;

use App\Models\Contracts\InsertDefaultValueInterface;
use App\Models\Traits\CurrencyTrait;
use App\Models\Traits\HelperTrait;
use App\Models\Traits\InsertDefaultValueTrait;
use App\Models\Users\Client;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Offer extends Model implements InsertDefaultValueInterface
{
    use HasFactory, CurrencyTrait, HelperTrait, InsertDefaultValueTrait;

    const STAGE = ['Accepted', 'Dead', 'Delivered', 'Draft', 'Lost'];

    public $currencyId = true;

    protected $table = "sys_quotes";

    public $timestamps = false;

    protected $casts = [
        'datecreated' => 'date',
        'validuntil' => 'date',
    ];

    public function getDefault(): array
    {
        return [
            'account' => [''],
            'firstname' => [''],
            'lastname' => [''],
            'companyname' => [''],
            'email' => [''],
            'address1' => [''],
            'address2' => [''],
            'city' => [''],
            'state' => [''],
            'postcode' => [''],
            'country' => [''],
            'phonenumber' => [''],
            'currency' => [0],
            'discount_type' => ['f'],
            'discount_value' => [0],
            'taxname' => [''],
            'taxrate' => [0],
            'tax1' => [0],
            'tax2' => [0],
            'adminnotes' => [0],
            'lastmodified' => [now()],
            'dateaccepted' => [now()],

        ];
    }

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
