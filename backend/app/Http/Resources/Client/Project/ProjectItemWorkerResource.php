<?php

namespace App\Http\Resources\Resident\Project;

use App\Http\Resources\Resident\Settings\CurrencyResource;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectItemWorkerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $format = "Y-m-d";
        $resource = [
            'id' => $this->id,
            'name' => $this->name,
            'type' => $this->billing_type,
            'status' => $this->status,
            'summary' => $this->summary,
            'description' => $this->description,
            'startDate' => $this->start_date?->format($format),
            'dueDate' => $this->due_date?->format($format),
            'users' => [
                'admin' => new UserResource($this->admin),
                'manager' => new UserResource($this->manager ?? $this->admin),
                'client' => new UserResource($this->client),
                'suppliers' => UserResource::collection($this->personalClients->where('user', '!=', null)->pluck('user')),
                'staff' => UserResource::collection($this->personalAdmins->where('user', '!=', null)->pluck('user')),
            ]
        ];

        return $resource;
    }
}
