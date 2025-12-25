<?php

namespace App\Http\Resources\Resident\Project\View;

use App\Http\Requests\Traits\TimeZoneTrait;
use App\Http\Resources\UserSmallResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LogResource extends JsonResource
{
    use TimeZoneTrait;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $date = $this->toTimeZoneClient('created_at');
        return [
            'id' => $this->id,
            'description' => $this->description,
            'user' => new UserSmallResource($this->user),
            'date' => $date->format('Y-m-d'),
            'time' => $date->format('h:i:s A')
        ];
    }
}
