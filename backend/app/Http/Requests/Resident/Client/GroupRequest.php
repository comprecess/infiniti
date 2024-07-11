<?php

namespace App\Http\Requests\Resident\Client;

use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class GroupRequest extends FormRequest implements ConvertingPropertiesInterface
{

    use ConvertingPropertiesTrait;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rule = Rule::unique('crm_groups', 'gname');
        if($this->route('group')) {
            $rule->ignore($this->route('group'));
        }
        return [
            'name' => [
                'required',
                'string',
                $rule
            ]
        ];
    }

    public function getListProperties(): array
    {
        return ['name' => 'gname'];
    }
}
