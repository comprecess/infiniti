<?php

namespace App\Models\Resident\Invoices;


use App\Models\Contracts\InsertDefaultValueInterface;
use App\Models\Traits\InsertDefaultValueTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class InvoiceItem extends Model implements InsertDefaultValueInterface
{
    use HasFactory, InsertDefaultValueTrait;

    protected $table = "sys_invoiceitems";

    public function service()
    {
        return $this->morphTo('service');
    }

    public function getDefault(): array
    {
        return [
            'type' => [''],
            'relid' => [0],
            'duedate' => [now()],
            'paymentmethod' => [''],
            'notes' => [''],
            'itemcode' => [''],
        ];
    }

}
