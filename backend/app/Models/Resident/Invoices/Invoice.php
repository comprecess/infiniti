<?php

namespace App\Models\Resident\Invoices;

use App\Models\Traits\CurrencyTrait;
use App\Models\Users\Client;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory, CurrencyTrait;

    protected $table = "sys_invoices";

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
