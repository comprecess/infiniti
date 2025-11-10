<?php

namespace App\Http\Resources\Resident\Project\View;

use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskTimeResource extends JsonResource
{

//    use TimeZoneTrait;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        $resource = [
            'id' => $this->id,
            'time' => $this->timeDate->format('H:i'),
            'description' => $this->description,
            'user' => new UserResource($this->user)
        ];


        return $resource;
    }
}
