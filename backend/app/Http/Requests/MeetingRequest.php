<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class MeetingRequest extends FormRequest
{
    const FORMAT_DATE = 'Y-m-d H:i';

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
//        $timezone = array_keys(config('data.timezone', []));
        return [
            'timezone' => 'required',
            'date' => 'required|date_format:' . self::FORMAT_DATE,
        ];
    }

    public function getDateArbitr() :Carbon
    {
        $date = Carbon::createFromFormat(self::FORMAT_DATE, $this->date, $this->timezone);
        return $date->setTimezone(0);
    }
}
