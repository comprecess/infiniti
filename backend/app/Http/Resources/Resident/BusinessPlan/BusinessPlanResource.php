<?php

namespace App\Http\Resources\Resident\BusinessPlan;

use App\Http\Resources\Resident\Client\ClientResource;
use App\Models\Config;
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
            'description' => $this->description,
            'exSummary' => $this->ex_summary,
            'mAnalysis' => $this->m_analysis,
            'management' => $this->management,
            'product' => $this->product,
            'marketing' => $this->marketing,
            'budget' => $this->budget,
            'investment' => $this->investment,
            'finance' => $this->finance,
            'appendix' => $this->appendix,
        ];

        return $data;
    }


}
