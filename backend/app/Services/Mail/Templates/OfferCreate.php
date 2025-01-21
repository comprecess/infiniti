<?php


namespace App\Services\Mail\Templates;


use App\Models\Resident\Invoices\Offer;
use App\Services\Mail\Resources\OfferResource;
use App\Services\Mail\Template;
use App\Services\PdfDocument;
use Barryvdh\DomPDF\Facade\Pdf;
use Mpdf\Output\Destination;

class OfferCreate extends Template
{

    public function requireVariables(): array
    {
        return [
            'offer' => Offer::class
        ];
    }

    public function defaultVariables(): array
    {
        $invoice = $this->varibles['offer'];
        $resource = new OfferResource($invoice);

        return $resource->toArray(app('request'));
    }

    public function getFile()
    {
        $invoice = $this->varibles['offer'];
//        $pdf = Pdf::loadView('pdf.offer', ['model' => $invoice]);
        $pdf = (new PdfDocument($invoice))->get(Destination::STRING_RETURN);
        return [$pdf, 'offer_'.$invoice->getCode().'.pdf'];
    }

    public function send() :void
    {
        $offer = $this->varibles['offer'];
        $offer->stage = Offer::STAGE[2];
        $offer->save();
    }



}
