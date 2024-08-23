<?php

namespace App\Http\Resources\Resident\Settings;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmailTemplateResource extends JsonResource
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
            'name' => $this->tplname,
            'subject' => $this->subject,
            'languageId' => $this->language_id,
            'message' => $this->message,
        ];
    }


}
