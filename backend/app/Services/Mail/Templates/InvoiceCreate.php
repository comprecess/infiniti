<?php


namespace App\Services\Mail\Templates;


use App\Models\Resident\Invoices\Invoice;
use App\Services\Mail\Resources\InvoiceResource;
use App\Services\Mail\Template;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceCreate extends  Template
{

    public function requireVariables(): array
    {
        return [
            'invoice' => Invoice::class
        ];
    }

    public function defaultVariables(): array
    {
        $invoice = $this->varibles['invoice'];
        $resource = new InvoiceResource($invoice);

        return $resource->toArray(app('request'));
    }

    public function getFile()
    {
        $invoice = $this->varibles['invoice'];
        $pdf = Pdf::loadView('pdf.invoice', ['model' => $invoice]);
        return [$pdf->output(), 'invoice_'.$invoice->getCode().'.pdf'];
    }



}
