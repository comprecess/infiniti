<?php

namespace App\Http\Requests;

use App\Http\Requests\Traits\TimeZoneTrait;
use App\Services\Zoom\Timezone;
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;

class MeetingRequest extends FormRequest
{
    use TimeZoneTrait;

    const FORMAT_DATE = 'Y-m-d H:i';

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $time = $this->getTimeTimezone('timezone.date');
        $timezoneList = (new Timezone())->getListTimezone();

        if(!isset($timezoneList[$time])) {
            throw ValidationException::withMessages(['timezone.date' => "Time with this time zone not found"]);
        }
        return [
            'timezone' => 'required|array',
            'timezone.name' => 'required',
            'timezone.date' => 'required|date_format:' . $this->timezoneFormat,
            'date' => 'required|date_format:' . self::FORMAT_DATE,
        ];
    }

    public function getDateArbitr() :Carbon
    {
        $date = Carbon::createFromFormat(self::FORMAT_DATE, $this->date, $this->getTimeTimezone('timezone.date'));
        return $date->setTimezone(0);
    }
}
