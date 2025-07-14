<?php

namespace App\Http\Resources\Resident\Project;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectInfoResource extends JsonResource
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
            'name' => $this->name,
            'budget' => $this->printPrice('budget'),
            'status' => $this->status,
            'dueDate' => $this->due_date?->format('d/m/Y'),
        ];


        return $resorce;
    }
}
