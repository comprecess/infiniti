<?php

namespace App\Http\Resources\Catalog;

use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserBlockResorce extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $resource = [
            'id' => $this->id,
            'position' => $this->position,
            'name' => $this->name,
            'periodFrom' => $this->from->format('M Y'),
            'periodTo' => $this->to?->format('M Y'),
            'responsibilities' => $this->responsibilities
        ];


        return $resource;
    }
}
