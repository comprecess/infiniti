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
            'date' => $this->created_at,
            'client' => new UserResource($this->client),
            'admin' => new UserResource($this->admin),
        ];
    }


}
