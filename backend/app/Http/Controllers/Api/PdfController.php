<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Config;
use App\Models\Resident\Invoices\Invoice;
use App\Models\Resident\Invoices\Offer;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Mpdf\Mpdf;


class PdfController extends Controller
{
    const PDF_DATA = [
        'invoice' => [Invoice::class, 'vtoken'],
        'offer' => [Offer::class, 'vtoken'],
    ];

//    public function index(Request $request)
//    {
//        $name = $request->route('name');
//        $pdf = Pdf::loadView('pdf.' . $name, ['model' => $this->getModel($request)]);
//        return $pdf->download($name . ".pdf");
//    }

    public function index(Request $request)
    {
        $model = $this->getModel($request);
        $name = $request->route('name');
        $companyName = Config::get('CompanyName');

        $pdf_c = '';
        if(Config::get('pdf_font') == 'default') {
            $pdf_c = 'c';
        }
        $mpdf = new mPDF([$pdf_c, 'A4', '', '', 20, 15, 15, 25, 10, 10]);

        $mpdf->SetTitle($companyName . ' ' . ucfirst($name));
        $mpdf->SetAuthor($companyName);
        if($model instanceof Invoice) {
            $statusValue = __("pdf.invoice.statusVar.{$model->status}");
        }else{
            $statusValue = __("pdf.offer.statusVar.{$model->stage}");
        }

        $mpdf->SetWatermarkText($statusValue);
        if(Config::get('invoice_show_watermark') == 1){
            $font = Config::get('pdf_font') == 'default' ? 'Helvetica' : 'dejavusanscondensed';
            $mpdf->showWatermarkText = true;
            $mpdf->watermark_font = $font;
            $mpdf->watermarkTextAlpha = 0.1;
        }

        $mpdf->SetDisplayMode('fullpage');

        if(Config::get('rtl') == 1) {
            $mpdf->SetDirectionality('rtl');
        }

        if(Config::get('pdf_font') == 'AdobeCJK') {
            $mpdf->useAdobeCJK = true;
            $mpdf->autoScriptToLang = true;
            $mpdf->autoLangToFont = true;

            $wf = Config::get('pdf_watermark_font');
            if ($wf && file_exists(base_path('vendor/mpdf/mpdf/ttfonts/' . $wf))) {
                $mpdf->watermark_font = $wf;
            }
        }

        $mpdf->WriteHTML(view('pdf.' . $name, ['model' => $model])->render());
        $mpdf->Output($model->getCode() . '.pdf', 'I');
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
