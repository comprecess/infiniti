<?php

namespace App\Http\Resources\Resident\Client\ClientView;

use App\Http\Requests\Traits\TimeZoneTrait;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmailLogResource extends JsonResource
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
            'subject' => $this->subject,
            'date' => $this->toTimeZoneClient('date', 'Y-m-d H:i:s'),
        ];
    }


}
