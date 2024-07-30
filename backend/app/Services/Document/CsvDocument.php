<?php


namespace App\Services\Document;

use App\Exports\ExcelExport;
use App\Exports\ExcelFileExport;
use Maatwebsite\Excel\Facades\Excel;

class CsvDocument extends Document
{

    public function generate()
    {

        return Excel::download(
            new ExcelExport($this->builder->get(), $this->varibles),
            $this->varibles->nameDocument . ".csv",
            \Maatwebsite\Excel\Excel::CSV
        );
    }

}
