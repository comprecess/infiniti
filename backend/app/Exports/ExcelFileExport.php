<?php

namespace App\Exports;


use App\Services\Document\DocumentVariables;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\WithDrawings;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;

class ExcelFileExport implements FromView, WithDrawings
{

    public function __construct(public $query, public DocumentVariables $varibles)
    {
    }

    public function view(): View
    {
        return view($this->varibles->excelView, ['varibles' => $this->varibles, 'data' => $this->query]);
    }

    public function drawings()
    {
        $callable = $this->varibles->excelFilesCollable;
        return $callable($this->query);

//        $images = [];
//
//        foreach($this->query as $key => $value) {
//            if($path = $value->getLastFile()?->getFile()?->getRealPath()) {
//                $drawing = new Drawing();
//                $drawing->setPath($path);
//                $drawing->setHeight(50);
//                $drawing->setCoordinates($this->varibles->excelFilesPosition . ($key + 2));
//                $images[] = $drawing;
//            }
//        }
//
//        return $images;
    }
}
