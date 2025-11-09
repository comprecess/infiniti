<?php

namespace App\Http\Requests\Resident\Project\View;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class AddTimeRequest extends FormRequest
{

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */

    public function rules(): array
    {
        return [
            'time' => 'required|date_format:H:i',
            'description' => 'nullable'
        ];

    }

    public function getTime()
    {
        return Carbon::createFromFormat('H:i', $this->time);
    }

}
