<?php

namespace App\Http\Resources\Resident\BusinessPlan;

use App\Http\Resources\Resident\Client\ClientSomeDataResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\BusinessModel\BusinessModelResource;

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
            'file' => $this->files->first()?->getLink(),
            'exSummary' => $this->ex_summary,
            'client' => new ClientSomeDataResource($this->client),
            'businessModel' => new BusinessModelResource($this->businessModel),
            'publicToken' => $this->public
        ];

        return $data;
    }


}
