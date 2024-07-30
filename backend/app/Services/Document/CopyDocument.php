<?php


namespace App\Services\Document;

use App\Exports\ExcelExport;
use App\Exports\ExcelFileExport;
use Maatwebsite\Excel\Facades\Excel;

class CopyDocument extends Document
{

    public function generate()
    {

        return Excel::raw(
            new ExcelExport($this->builder->get(), $this->varibles),
            \Maatwebsite\Excel\Excel::CSV
        );
    }

}
