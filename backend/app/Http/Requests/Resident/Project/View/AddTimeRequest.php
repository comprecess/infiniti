<?php

namespace App\Http\Requests\Resident\Project\View;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;

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
            'date' => 'required|date_format:Y-m-d',
            'time' => 'required|regex:/[0-9]{1,3}\:[0-9]{1,2}/',
            'description' => 'nullable'
        ];

    }

    public function getTime()
    {
        $time = explode(':', $this->time);
        if(intval($time[1]) > 59 || intval($time[0]) > 999) {
            throw ValidationException::withMessages(['time' => "The time field format is invalid."]);
        }
        return ['date' => Carbon::createFromFormat('Y-m-d', $this->date), 'time' => $this->time];
    }

}
