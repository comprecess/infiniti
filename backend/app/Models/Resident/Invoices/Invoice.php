<?php

namespace App\Models\Resident\Invoices;

use App\Models\Collection\InvoiceCollection;
use App\Models\Traits\CollectionTrait;
use App\Models\Traits\CurrencyTrait;
use App\Models\Users\Client;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory, CurrencyTrait, CollectionTrait;

    const STATUS = [
        'Unpaid', 'Paid', 'Partially Paid', 'Cancelled'
    ];

    protected $table = "sys_invoices";

    public $collection = InvoiceCollection::class;

    protected $casts = [
      'date' => 'date',
      'duedate' => 'date',
    ];

    public function getCode()
    {
        return $this->invoicenum . ($this->cn ? $this->cn : $this->id);
    }

    public function user()
    {
        return $this->belongsTo(Client::class, 'userid');
    }
}
