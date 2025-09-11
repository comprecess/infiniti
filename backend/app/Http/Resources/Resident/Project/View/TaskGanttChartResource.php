<?php

namespace App\Http\Resources\Resident\Project\View;

//use App\Http\Requests\Traits\TimeZoneTrait;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskGanttChartResource extends JsonResource
{

//    use TimeZoneTrait;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

//        $tz = $this->getTimeTimezone();
        $start = $this->started ?? $this->project->start_date;
        $end = $this->due_date ?? now();
        $diff = $start->diff($end);

        $resorce = [
            'id' => $this->id,
            'text' => $this->title,
//            'start' => $start->format('Y-m-d'),
//            'end' => $end->format('Y-m-d'),
            'start' => $start->format('r'),
            'end' => $end->format('r'),
            'progress' => $this->ganttCharProgressDate(),
            'duration' => $diff->days + 1,
            'type' => 'task'
        ];


        return $resorce;
    }
}
