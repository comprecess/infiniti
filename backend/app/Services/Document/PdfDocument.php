<?php


namespace App\Services\Document;


use Barryvdh\DomPDF\Facade\Pdf;

class PdfDocument extends Document
{

    public function generate()
    {
        $pdf = PDF::loadView('document.pdf', [
            'varibles' => $this->varibles,
            'data' => $this->varibles->resource
                ? json_decode($this->varibles->resource::collection($this->builder->get())->toJson())
                : $this->builder->get()
        ]);

        return $pdf->download($this->varibles->nameDocument . ".pdf");
    }

}
