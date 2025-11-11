<?php

namespace App\Http\Resources\Resident\Project\View;

use App\Http\Requests\Traits\TimeZoneTrait;
use App\Http\Resources\UserResource;
use App\Models\Config;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
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
        $started = $this->started?->setTimezone($tz);
        $create = $this->created_at->setTimezone($tz);
        $dueDate = $this->due_date?->setTimezone($tz);

        $format = Config::get('df');
        $resource = [
            'id' => $this->id,
            'title' => $this->title,
            'admin' => new UserResource($this->admin),
            'client' => new UserResource($this->client),
            'status' => $this->statusColumn(),
            'created' => $create?->diffForHumans(),
            'dueDate' => $dueDate?->format($format),
            'description' => $this->description,
            'start' => $started?->format('Y-m-d'),
            'end' => $dueDate?->format('Y-m-d'),
            'users' => UserResource::collection($this->personals->where('user', '!=', null)->pluck('user')),
        ];


        return $resource;
    }
}
