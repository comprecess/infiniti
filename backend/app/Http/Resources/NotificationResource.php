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

        $dateActive = $this->date_active;
        $createdAt = $this->date_active;
        if($request->timezone) {
            $dateActive?->setTimezonr($request->timezone);
            $createdAt->setTimezonr($request->timezone);
        }

        return [
            'id' => $this->id,
            'message' => $this->getMessage(),
            'dateActive' => $dateActive?->format("Y-m-d H:i:s"),
            'dateCreate' => $createdAt?->format("Y-m-d H:i:s"),
            'viewed' => $this->viewed,
            'status' => $this->viewed == 0 || $date,
        ];
    }


}
