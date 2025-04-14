<?php

namespace App\Http\Resources;

use App\Http\Resources\Resident\Client\ClientResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $date = false;
        if($this->date_active) {
            $date = $this->date_active > now();
        }

        return [
            'id' => $this->id,
            'message' => $this->getMessage(),
            'dateActive' => $this->date_active?->format("Y-m-d H:i:s"),
            'dateCreate' => $this->created_at?->format("Y-m-d H:i:s"),
            'viewed' => $this->viewed,
            'status' => $this->viewed == 0 || $date,
        ];
    }


}
