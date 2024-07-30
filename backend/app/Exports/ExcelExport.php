<?php

namespace App\Exports;

use App\Services\Document\DocumentVariables;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\WithCustomCsvSettings;

class ExcelExport implements FromView, WithCustomCsvSettings
{

    public function __construct(public $query, public DocumentVariables $varibles)
    {
    }

    public function view(): View
    {
        return view($this->varibles->excelView, ['varibles' => $this->varibles, 'data' => $this->query]);
    }

    public function getCsvSettings(): array
    {
        return [
            'input_encoding' => 'UTF-8',
            'delimiter' => "\t"
        ];
    }
}
