<?php

namespace App\Http\Resources\Resident\Client\ClientView;

use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ActivityResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'message' => $this->msg,
            'icon' => $this->icon,
            'time' => $this->created_at->diffForHumans(),
            'date' => $this->created_at->format('d/m/Y'),
            'dateTime' => $this->created_at->format('H:i'),
            'client' => new UserResource($this->client),
            'admin' => new UserResource($this->admin),
            'noDelete' => $this->no_delete ? 1 : 0
        ];
    }


}
