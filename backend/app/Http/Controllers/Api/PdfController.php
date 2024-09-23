<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Resident\Invoices\Invoice;
use App\Models\Users\Client;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;


class PdfController extends Controller
{
    const PDF_DATA = [
        'invoice' => [Invoice::class, 'vtoken']
    ];

    public function index(Request $request)
    {
        $name = $request->route('name');
        $pdf = Pdf::loadView('pdf.' . $name, ['model' => $this->getModel($request)]);
        return $pdf->download($name . ".pdf");
    }

    private function getModel(Request $request)
    {
        $name = $request->route('name');
        $token = $request->route('token');

        $data = Arr::get(self::PDF_DATA, $name);

        if(!$data) {
            abort(404);
        }

        $model = $data[0]::where($data[1], $token)->orderBy('id', 'desc')->first();

        if(!$model) {
            abort(404);
        }

        return $model;

    }
}
