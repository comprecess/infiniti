<?php

namespace App\Http\Resources\Catalog;

use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;

class UserResorce extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $resorce = [
            'id' => $this->id,
            'available' => $this->getAvailable(),
            'user' => new UserResource($this->user),
            'properties' => PropertyUserResorce::collection($this->getTreePropValuesCollection()),
            'experience' => $this->getExpirence(),
            'blockExperience' => UserBlockResorce::collection($this->blockExperience)
        ];

        return $resorce;
    }
}
