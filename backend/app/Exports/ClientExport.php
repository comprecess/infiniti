<?php

namespace App\Exports;

use App\Models\Users\Client;
use App\Services\Document\DocumentVariables;
use Illuminate\Contracts\View\View;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Database\Query\Builder;
use Laravel\Scout\Builder as ScoutBuilder;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithDrawings;
use Maatwebsite\Excel\Concerns\WithHeadings;
use PhpOffice\PhpSpreadsheet\Worksheet\BaseDrawing;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;

class ClientExport implements FromView, WithDrawings/*, WithColumnWidths, FromQuery, WithHeadings*/
{

    public function __construct(public $query, public $data, public DocumentVariables $varibles)
    {
    }

    public function view(): View
    {
        return view('document.excel', ['varibles' => $this->varibles, 'data' => $this->data]);
    }

    public function drawings()
    {
        $images = [];

        foreach($this->query as $key => $value) {
            if($path = $value->getLastFile()?->getFile()?->getRealPath()) {
                $drawing = new Drawing();
                $drawing->setPath($path);
                $drawing->setHeight(50);
                $drawing->setCoordinates('A' . ($key + 2));
                $images[] = $drawing;
            }
        }

        return $images;
    }

    public function query()
    {
        return $this->query;
    }

    public function headings(): array
    {
        return $this->varibles->columns;
    }

//    public function columnWidths(): array
//    {
////        return $this->varibles->columnWidthsExcel;
//        return [];
//    }
}
