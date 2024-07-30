<?php


namespace App\Services\Document;

use App\Exports\ExcelExport;
use App\Exports\ExcelFileExport;
use Maatwebsite\Excel\Facades\Excel;

class ExcelDocument extends Document
{

    public function generate()
    {

        if(!$this->varibles->excelView) {
            return null;
        }

        if(is_callable($this->varibles->excelFilesCollable)) {
            return Excel::download(
                new ExcelFileExport($this->builder->get(), $this->varibles),
                $this->varibles->nameDocument . ".xlsx"
            );
        }

        return Excel::download(
            new ExcelExport($this->builder->get(), $this->varibles),
            $this->varibles->nameDocument . ".xlsx"
        );
    }

}
