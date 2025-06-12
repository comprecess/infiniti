<?php

namespace App\Http\Requests\Calendar;

use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Arr;

class CalendarCreateRequest extends FormRequest implements ConvertingPropertiesInterface
{
    use ConvertingPropertiesTrait;

    const FORMAT = 'Y-m-d H:i';


    public function rules(): array
    {

        $rules = [
            'title' => 'required',
            'start' => 'required|date_format:' . self::FORMAT,
            'end' => 'nullable|date_format:' . self::FORMAT,
            'timezone' => [
                'nullable',
                'regex:/[+-]?[0-9]{2}:[0-9]{2}/u'
            ],
            'allDay' => 'nullable|boolean',
            'color' => 'nullable',
            'description' => 'nullable'
        ];

        return $rules;
    }

    public function getDate($name = 'start')
    {
        $data = $this->all();
        if($date = Arr::get($this->all(), "{$name}")) {
            $timezone = Arr::get($data, 'timezone') ?? null;
            if($timezone && !in_array($timezone[0], ['+', '-'])) {
                $timezone = '+'.$timezone;
            }
            $dateCarbon =  Carbon::createFromFormat(self::FORMAT, $date, $timezone);
            return $dateCarbon->setTimezone(0);
        }
        return null;
    }


    public function getListProperties() :array
    {
        return [
            'title',
            'allDay' => 'allday',
            'color',
            'description'
        ];
    }
}
