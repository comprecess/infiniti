<?php

namespace App\Http\Resources\Calendar;


use App\Models\Config;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CalendarListResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        $format = Config::get('df');
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'color' => $this->color,
            'start' => $this->start?->format('Y-m-d H:i'),
            'end' => $this->end?->format('Y-m-d H:i'),
            'allDay' => $this->allday,
        ];
    }

}
