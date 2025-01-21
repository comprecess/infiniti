<?php


namespace App\Services\Mail\Templates;


use App\Models\Resident\Invoices\Invoice;
use App\Services\Mail\Resources\InvoiceResource;
use App\Services\Mail\Template;
use App\Services\PdfDocument;
use Barryvdh\DomPDF\Facade\Pdf;
use Mpdf\Output\Destination;

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
//        $pdf = Pdf::loadView('pdf.invoice', ['model' => $invoice]);
        $pdf = (new PdfDocument($invoice))->get(Destination::STRING_RETURN);
        return [$pdf, 'invoice_'.$invoice->getCode().'.pdf'];
    }



}
