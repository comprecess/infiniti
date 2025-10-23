<?php

namespace App\Http\Resources\Client\BusinessPlan;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BusinessPlanResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
            'id' => $this->id,
            'companyName' => $this->company_name,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'date' => $this->date?->format('Y-m-d'),
            'website' => $this->website,
            'publicToken' => $this->public
        ];

        return $data;
    }


}
