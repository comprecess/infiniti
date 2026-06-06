<?php

namespace App\Http\Resources\Resident\Project;

use App\Http\Resources\Resident\Settings\CurrencyResource;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectItemResource extends JsonResource
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
            'template_code' => $this->template_code,
//            'owner' => new UserResource($this->admin),
//            'staff' => new UserResource($this->manager),
//            'client' => new UserResource($this->client),
            'type' => $this->billing_type,
            'status' => $this->status,
            'summary' => $this->summary,
            'budget' => round($this->budget, 2),
            'currency' => new CurrencyResource($this->getCurrencyIso),
            'description' => $this->description,
            'startDate' => $this->start_date?->format($format),
            'dueDate' => $this->due_date?->format($format),
//            'members' => UserResource::collection($this->getMembers())
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
