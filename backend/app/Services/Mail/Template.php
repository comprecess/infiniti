<?php


namespace App\Services\Mail;


use App\Models\Resident\Settings\EmailTemplate;
use App\Services\Mail\Templates\InvoiceCreate;
use App\Services\Mail\Templates\OfferCreate;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;
use Illuminate\Validation\ValidationException;

abstract class Template
{
    public static $list = [
        'invoice-create' => [InvoiceCreate::class, 'Invoice:Invoice Created'],
        'reminder' => [InvoiceCreate::class, 'Invoice:Invoice Payment Reminder'],
        'overdue' => [InvoiceCreate::class, 'Invoice:Invoice Overdue Notice'],
        'confirm' => [InvoiceCreate::class, 'Invoice:Invoice Payment Confirmation'],
        'refund' => [InvoiceCreate::class, 'Invoice:Invoice Refund Confirmation'],
        'offer-create' => [OfferCreate::class, 'Quote:Quote Created']
    ];

    protected $varibles = [];

    protected $paternVariable = "/\{\{([a-z0-9\_\-\.]*)\}\}/";

    public function __construct(
        protected $nameTemplate
    ){}

    public function defaultVariables() :array
    {
        return  [];
    }

    public function requireVariables() :array
    {
        return  [];
    }

    public function getFile()
    {
        return null;
    }

    public function send() :void
    {

    }

    public function setVariables($name, $value)
    {
        $this->varibles[$name] = $value;
    }

    public function hasRequire()
    {
        foreach ($this->requireVariables() as $name => $mixed) {
            if(isset($this->varibles[$name])) {
                if(class_exists($mixed)) {
                    $object = new $mixed();
                    if($object instanceof Model) {
                        $this->varibles[$name] = $object::findOrFail($this->varibles[$name]);
                    }
                }
            } else {
                throw ValidationException::withMessages([$name => __('validation.required', ['attribute' => $name])]);
            }
        }
    }

    public function render()
    {
        $model = EmailTemplate::where('tplname', $this->nameTemplate)->first();

        if(!$model) {
            abort(404);
        }

        $listVariable = array_merge($this->varibles, $this->defaultVariables());

        $template = $model->message;
        $this->replaceTemplate($template, $listVariable);

        $subject = $model->subject;
        $this->replaceTemplate($subject, $listVariable);

        $data = ['subject' => $subject, 'message' => $template, 'file' => null];

        $file = $this->getFile();
        if($file){
            $data['file'] = $file[1];
        }

        return $data;
    }

    private function replaceTemplate(string &$message, array $value)
    {
        preg_match_all($this->paternVariable, $message, $templateVariable);


        if(isset($templateVariable[0])) {
            foreach($templateVariable[0] as $key => $var) {
                $v = Arr::get($value, $templateVariable[1][$key]);
                $message = str_replace($var, $v, $message);
            }
        }
    }

}
