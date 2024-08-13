<?php

namespace App\Http\Resources\Resident\Client\ClientView;

use App\Http\Resources\UserResource;
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
            'time' => $this->date->diffForHumans(),
            'ip' => $this->ip,
            'description' => $this->description,
        ];
    }


}
