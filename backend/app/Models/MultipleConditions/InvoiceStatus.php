<?php


namespace App\Models\MultipleConditions;


use App\Models\Resident\Invoices\Invoice;

class InvoiceStatus extends MultipleConditions
{
    protected function Unpaid(Invoice $invoice)
    {
        return [
            'unpaid_amount' => $invoice->transformPrice('total')
        ];
    }

    protected function Paid(Invoice $invoice)
    {
        return [
            'paid_amount' => $invoice->transformPrice('total')
        ];
    }

    protected function PartiallyPaid(Invoice $invoice)
    {
        return [
            'paid_amount' => $invoice->credit,
            'unpaid_amount' => $invoice->transformPrice('total') - $invoice->credit,
            'partially_paid_amount' => $invoice->credit,
        ];
    }

    protected function Cancelled(Invoice $invoice)
    {
        return [
          'cancelled_amount' => $invoice->transformPrice('total')
        ];
    }
}
