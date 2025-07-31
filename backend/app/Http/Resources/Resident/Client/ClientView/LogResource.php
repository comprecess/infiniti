<?php

namespace App\Http\Resources\Resident\Client\ClientView;

use App\Http\Requests\Traits\TimeZoneTrait;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LogResource extends JsonResource
{
    use TimeZoneTrait;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'time' => $this->toTimeZoneClient('date')->diffForHumans(),
            'ip' => $this->ip,
            'description' => $this->description,
        ];
    }


}
