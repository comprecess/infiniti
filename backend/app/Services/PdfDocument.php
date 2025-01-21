<?php


namespace App\Services;


use App\Models\Config;
use Mpdf\Mpdf;
use Mpdf\Output\Destination;

class PdfDocument
{
    public function __construct(
        private $model
    )
    {
    }

    public function get($typeEcho = Destination::INLINE)
    {
        $companyName = Config::get('CompanyName');
        $name = get_class($this->model);
        $name = explode('\\', $name);
        $name = strtolower($name[count($name) - 1]);

        $pdf_c = '';
        if(Config::get('pdf_font') == 'default') {
            $pdf_c = 'c';
        }
        $mpdf = new mPDF([$pdf_c, 'A4', '', '', 20, 15, 15, 25, 10, 10]);

        $mpdf->SetTitle($companyName . ' ' . ucfirst($name));
        $mpdf->SetAuthor($companyName);
        if($this->model instanceof Invoice) {
            $statusValue = __("pdf.invoice.statusVar.{$this->model->status}");
        }else{
            $statusValue = __("pdf.offer.statusVar.{$this->model->stage}");
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

        $mpdf->WriteHTML(view('pdf.' . $name, ['model' => $this->model])->render());
        $mpdf->Output($this->model->getCode() . '.pdf', $typeEcho);
    }
}
