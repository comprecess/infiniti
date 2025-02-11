<?php

namespace App\Http\Resources\Resident;

use App\Http\Resources\Resident\Client\ClientResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChatGPTResource extends JsonResource
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
            'type' => $this->parent_id ? "out" : "in",
            'message' => $this->message,
            'create' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }


}
