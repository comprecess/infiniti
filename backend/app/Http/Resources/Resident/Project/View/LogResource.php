<?php

namespace App\Http\Resources\Resident\Project\View;

use App\Http\Resources\UserSmallResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LogResource extends JsonResource
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
            'description' => $this->description,
            'user' => new UserSmallResource($this->user),
            'date' => $this->created_at->format('Y-m-d'),
            'time' => $this->created_at->format('h:i:s A')
        ];
    }
}
