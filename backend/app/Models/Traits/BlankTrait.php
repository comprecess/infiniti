<?php


namespace App\Models\Traits;


use App\Models\Resident\Invoices\InvoiceItem;

trait BlankTrait
{
    public function items()
    {
        return $this->morphMany(InvoiceItem::class, 'document');
    }

}
