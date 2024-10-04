<?php


namespace App\Services\Mail\Templates;


use App\Models\Resident\Invoices\Offer;
use App\Services\Mail\Resources\OfferResource;
use App\Services\Mail\Template;
use Barryvdh\DomPDF\Facade\Pdf;

class OfferCreate extends  Template
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
        $pdf = Pdf::loadView('pdf.offer', ['model' => $invoice]);
        return [$pdf->output(), 'offer_'.$invoice->getCode().'.pdf'];
    }



}
