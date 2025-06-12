<?php

namespace App\Http\Requests\Calendar;

use App\Http\Requests\Resident\DocumentRequest;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use App\Models\Resident\Transactions\Transaction;
use Carbon\Carbon;
use Illuminate\Support\Arr;

class CalendarListRequest extends DocumentRequest
{
    use ConvertingPropertiesTrait;

    const FORMAT = 'Y-m-d';

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function isDocument()
    {
        return false;
    }


    public function sort() :array
    {
        return [
            'id' => 'sys_events.id',
        ];
    }

    public function rules(): array
    {
        $rules = array_merge([
            'filter.start' => 'nullable|date_format:' . self::FORMAT,
            'filter.end' => 'nullable|date_format:' . self::FORMAT,
            'filter.timezone' => [
                'nullable',
                'regex:/[+-]?[0-9]{2}:[0-9]{2}/u'
            ]
        ], parent::rules());

        return $rules;
    }

    public function getDate($name = 'start')
    {
        $data = $this->all();
        if($date = Arr::get($this->all(), "filter.{$name}")) {
            $timezone = Arr::get($data, 'filter.timezone') ?? null;
            if($timezone && !in_array($timezone[0], ['+', '-'])) {
                $timezone = '+'.$timezone;
            }
            $dateCarbon =  Carbon::createFromFormat(self::FORMAT, $date, $timezone);
            return $dateCarbon->setTimezone(0);
        }
        return null;
    }

    public function filter($query)
    {
        $data = $this->all();


        if($start = $this->getDate()) {
            $start->setHour(0)->setMinute(0)->setSecond(0);
            $query->where('start', '>=', $start);
        }

        if($end = $this->getDate('end')) {
            $end->setHour(23)->setMinute(59)->setSecond(59);
            $query->where('end', '<=', $start);
        }

        if($search = Arr::get($data, 'filter.search')) {
            $search = "%{$search}%";
            $query->where(function($query) use($search){
                $query->where('id', 'like', $search)
                    ->orWhere('title', 'like', $search)
                    ->orWhere('description', 'like', $search);
            });
        }

    }
}
