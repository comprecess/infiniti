<?php

namespace App\Http\Resources\Resident\BusinessPlan;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BusinessPlanDocumentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
            'img' => $this->client ? '<img src="'.$this->client?->getLastFile()?->getFile()?->getRealPath().'">' : '',
            'account' => $this->client?->account . '<br>' . $this->client?->code,
            'model' => $this->businessModel?->title,
            'company' => $this->company_name,
            ];

        return $data;
    }


}
