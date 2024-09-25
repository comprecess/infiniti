<?php

namespace App\Services\Mail\Requests;



use App\Services\Mail\Template;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Arr;


class MailTemplateRequest extends FormRequest
{

    public function rules(): array
    {
        $this->merge(['nameTemplate' => $this->route('nameTemplate')]);
        $rules = [
            'nameTemplate' => 'required|in:' . implode(',', array_keys(Template::$list))
        ];

        return $rules;
    }

    public function getTemplate()
    {
        list($class, $template) = Template::$list[$this->nameTemplate];
        $object = new $class($template);

        if(!($object instanceof Template)) {
            abort(404);
        }

        $varible = explode('/', $this->varible);
        if(count($varible)) {
            for($i=0; $i < count($varible); $i+=2) {
                if($varible[$i] != '') {
                    $object->setVariables($varible[$i], Arr::get($varible, $i+1));
                }
            }
        }

        $object->hasRequire();

        return $object;
    }


}
