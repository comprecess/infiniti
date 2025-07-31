<?php

namespace App\Http\Resources\Resident\Client\ClientView;

use App\Http\Requests\Traits\TimeZoneTrait;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ActivityResource extends JsonResource
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
            'message' => $this->msg,
            'icon' => $this->icon,
            'time' => $date->diffForHumans(),
            'date' => $date->format('d/m/Y'),
            'dateTime' => $date->format('H:i'),
            'client' => new UserResource($this->client),
            'admin' => new UserResource($this->admin),
            'noDelete' => $this->no_delete ? 1 : 0
        ];
    }


}
