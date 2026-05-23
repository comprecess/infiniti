<?php

namespace App\Http\Resources\Resident\BusinessPlan;


use App\Http\Resources\Resident\Talents\TalentPropResource;
use App\Http\Resources\Traits\NestedParametersTrait;
use App\Http\Resources\Traits\PropValuesTrait;
use App\Models\BusinessModel\BusinessModel;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BusinessModelResource extends JsonResource
{
    use NestedParametersTrait, PropValuesTrait;

    public function toArray(Request $request): array
    {
        $prop = collect([]);
        foreach($this->values as $value) {
            $p = $prop->where('id', $value->prop->id);
            if(!$p->count()) {
                $prop->push($value->prop);
            }

            $prop->where('id', $value->prop->id)->each(function(&$item) use($value){
               if(!$item->userValue) {
                   $item->userValue = collect([]);
               }
                $item->userValue->push($value);
            });
        }

        $data = [
            'id' => $this->id,
            'title' => $this->title,
            'start' => $this->start?->format('Y-m-d'),
            'description' => $this->description,
            'fullDescription' => $this->full_description,
            'marketAnalysis' => $this->market_analysis,
            'financialModel' => $this->financial_model,
            'currentInvestors' => $this->current_investors,
            'stagesOfImplementation' => $this->stages_implementation,
            'partnershipOptions' => $this->partnership_options,
            'targetClient' => $this->target_client,
            'valueProposition' => $this->value_proposition,
            'revenueLogic' => $this->revenue_logic,
            'unitEconomics' => $this->unit_economics,
            'factsHypothesesRisks' => $this->facts_hypotheses_risks,
            'property' => TalentPropResource::collection($prop),
        ];

        foreach(BusinessModel::TYPE_IMG as $type) {
            $data[$type] = $this->getFileType($type)?->first()?->getLink();
        }

        return $data;
    }

}
