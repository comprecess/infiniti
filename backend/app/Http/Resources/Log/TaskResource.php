<?php

namespace App\Http\Resources\Log;

use App\Http\Requests\Traits\TimeZoneTrait;
use App\Http\Resources\UserResource;
use App\Models\Config;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{

    use TimeZoneTrait;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $resource = [
            'id' => $this->id,
            'title' => $this->title,
        ];


        return $resource;
    }
}
