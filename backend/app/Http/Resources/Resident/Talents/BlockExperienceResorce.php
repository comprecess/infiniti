<?php

namespace App\Http\Resources\Resident\Talents;

use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BlockExperienceResorce extends JsonResource
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
            'idTalent' => $this->id_catalog_user,
            'position' => $this->position,
            'name' => $this->name,
            'periodFrom' => $this->from->format('Y-m-d'),
            'periodTo' => $this->to?->format('Y-m-d'),
            'responsibilities' => $this->responsibilities
        ];


        return $resorce;
    }
}
