<?php

namespace App\Http\Resources\Resident\BusinessPlan;

use App\Http\Resources\Resident\Client\ClientResource;
use App\Http\Resources\Traits\ToChatTrait;
use App\Models\Config;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BusinessPlanChatGPTResource extends JsonResource
{
    use ToChatTrait;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
            'company_name' => $this->company_name,
            'name' => $this->name,
            'description' => $this->description,
            'ex_summary' => $this->ex_summary,
            'm_analysis' => $this->m_analysis,
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

    public function namesToChat() :array
    {
        return [
            'company_name' => 'название компании',
            'name' => 'имя',
        ];
    }


}
