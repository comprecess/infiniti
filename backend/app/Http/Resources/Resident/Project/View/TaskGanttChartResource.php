<?php

namespace App\Http\Resources\Resident\Project\View;

use App\Http\Requests\Traits\TimeZoneTrait;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskGanttChartResource extends JsonResource
{

    use TimeZoneTrait;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        $tz = $this->getTimeTimezone();
        $end = now();

        $resorce = [
            'id' => $this->id,
            'text' => $this->title,
            'start' => ($this->started ?? $this->project->start_date)->setTimezone($tz)->format('Y-m-d'),
            'end' => ($this->due_date ?? $end)->setTimezone($tz)->format('Y-m-d'),
            'progress' => $this->ganttCharProgressDate(),
            'type' => 'task'
        ];


        return $resorce;
    }
}
