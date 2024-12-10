<?php

namespace App\Http\Resources\Resident\BusinessPlan;

use App\Http\Resources\Resident\Client\ClientResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BusinessPlanListResource extends JsonResource
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
            'exSummary' => $this->ex_summary
        ];

        return $data;
    }


}
