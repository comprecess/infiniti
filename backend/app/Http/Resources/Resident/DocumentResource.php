<?php

namespace App\Http\Resources\Resident;

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
        $client = $this->client;
        $data = [
            'id' => $this->id,
            'title' => $this->title,
            'type' => $this->file_mime_type,
            'global' => $this->is_global,
            'link' => $this->getLink(),
        ];

        if($client) {
            $data['client'] = new ClientResource($client);
            $data['update'] = $this->updated_at?->format('d/m/Y');
        }

        return $data;
    }


}
