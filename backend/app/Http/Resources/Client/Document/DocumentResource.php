<?php

namespace App\Http\Resources\Client\Document;

use App\Http\Resources\Resident\Client\ClientResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DocumentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        $data = [
            'title' => $this->title,
            'type' => $this->file_mime_type,
            'global' => $this->is_global,
            'link' => $this->getLink(),
            'update' => $this->updated_at?->format('d/m/Y') ?? $this->created_at?->format('d/m/Y')
        ];

        return $data;
    }


}
