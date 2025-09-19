<?php

namespace App\Http\Resources\Resident\BusinessPlan;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BusinessPlanDocumentExcelResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
            'img' => '',
            'account' => $this->client?->account . "\r\n" . $this->client?->code,
            'model' => $this->businessModel?->title,
            'company' => $this->company_name,
            ];

        return $data;
    }


}
