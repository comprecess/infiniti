<?php

namespace App\Http\Requests\Resident\Project\View;

use Illuminate\Foundation\Http\FormRequest;

class GanttChartRequest extends FormRequest
{

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */

    public function rules(): array
    {
        return [
            'start' => 'nullable|date_format:Y-m-d',
            'end' => 'nullable|date_format:Y-m-d',
        ];

    }


}
