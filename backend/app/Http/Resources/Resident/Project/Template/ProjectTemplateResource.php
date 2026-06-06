<?php

namespace App\Http\Resources\Resident\Project\Template;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectTemplateResource extends JsonResource
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
            'description' => $this->description,
            'default_roles' => $this->default_roles,
            'default_statuses' => $this->default_statuses,
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,
            'sections' => ProjectTemplateSectionResource::collection(
                $this->whenLoaded('sections', $this->sections ?? collect())
            ),
            'all_sections' => ProjectTemplateSectionResource::collection(
                $this->whenLoaded('allSections', $this->allSections ?? collect())
            ),
        ];
    }
}
