<?php

namespace App\Http\Requests\Resident\Client\View;

use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use App\Models\Users\Client;
use App\Services\Tools\Countries;
use Illuminate\Foundation\Http\FormRequest;

class ActivityRequest extends FormRequest implements ConvertingPropertiesInterface
{
    use ConvertingPropertiesTrait;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */

    public function rules(): array
    {
        if(!$this->icon) {
            $this->merge(['icon' => 'check']);
        }
        return [
            'message' => "required",
        ];
    }


    public function getListProperties(): array
    {
        return [
            'message' => 'msg',
            'icon',
        ];
    }
}
