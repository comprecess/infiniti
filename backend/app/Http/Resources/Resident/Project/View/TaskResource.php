<?php

namespace App\Http\Resources\Resident\Project\View;

use App\Http\Resources\UserResource;
use App\Models\Config;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $format = Config::get('df');
        $resorce = [
            'id' => $this->id,
            'title' => $this->title,
            'admin' => new UserResource($this->admin),
            'status' => $this->status,
            'created' => $this->started?->diffForHumans(),
            'dueDate' => $this->due_date?->format($format),
            'description' => $this->description,
            'start' => $this->started?->format('Y-m-d'),
            'end' => $this->due_date?->format('Y-m-d'),
        ];


        return $resorce;
    }
}
