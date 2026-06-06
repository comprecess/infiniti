<?php

namespace App\Http\Resources\Resident\Project\Template;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectTemplateSectionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'icon' => $this->icon,
            'sort_order' => $this->sort_order,
            'config' => $this->config,
            'is_required' => $this->is_required,
            'is_active' => $this->is_active,
        ];
    }
}
