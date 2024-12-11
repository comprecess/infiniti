<?php

namespace App\Http\Requests\Resident\Settings;

use App\Models\Catalog\Cart;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CurrencyRequest extends FormRequest
{
    protected $currencyConf = null;
    public function __construct(array $query = [], array $request = [], array $attributes = [], array $cookies = [], array $files = [], array $server = [], $content = null)
    {
        $this->currencyConf = config('data.currency');
        parent::__construct($query, $request, $attributes, $cookies, $files, $server, $content);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $cur = array_keys($this->currencyConf);
//        $rule = Rule::unique('sys_currencies', 'iso_code');
//        if($this->route('currency')) {
//            $rule->ignore($this->route('currency'));
//        }
        return [
            'code' => [
                'required',
                'string',
                Rule::in($cur),
//                $rule/*->ignore()*/
            ],
            'rate' => 'decimal:1,6'
        ];
    }

    public function getCurrency()
    {
        if(isset($this->currencyConf[$this->code])) {
            $this->currencyConf[$this->code]['nameCode'] = $this->code;
            return $this->currencyConf[$this->code];
        }
        return null;
    }
}
