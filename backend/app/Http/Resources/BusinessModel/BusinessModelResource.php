<?php

namespace App\Http\Resources\BusinessModel;

use App\Http\Resources\Traits\NestedParametersTrait;
use App\Http\Resources\Traits\PropValuesTrait;
use App\Models\BusinessModel\BusinessModel;
use App\Models\Catalog\Prop;
use App\Models\Catalog\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BusinessModelResource extends JsonResource
{
    use NestedParametersTrait, PropValuesTrait;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */

    public static $isCollection = false;

    public function toArray(Request $request): array
    {
        $industries = $this->getPropValues('industries', null);
        $technologies = $this->getPropValues('technologies', null);

        $resource = [
            'id' => $this->id,
            'title' => $this->title,
            'start' => $this->start?->format('Y-m-d'),
            'description' => $this->description,
            'category' => ValueResource::collection($this->getPropValues('category', null)),
            'age' => $this->getPropValues('age'),
            'industries' => ValueResource::collection(self::$isCollection ? ($industries->count() ? $industries?->chunk(3)?->first() : collect([])) : $industries),
            'technologies' => ValueResource::collection(self::$isCollection ? ( $technologies->count() ? $technologies?->chunk(3)?->first() : collect([]) ) : $technologies),
            'price' => $this->printPrice((int) $this->getPropValues('price')),
            'priceAmount' => (float) $this->getPropValues('price'),
            'profitability' => ValueResource::collection($this->getPropValues('profitability', null)),
            'location' => ValueResource::collection($this->getPropValues('location', null)),
            BusinessModel::TYPE_IMG[0] => $this->getFileType(BusinessModel::TYPE_IMG[0])->first()?->getLink(),
            'publicToken' => $this->public
        ];

        if(!self::$isCollection) {
            $resource[BusinessModel::TYPE_IMG[1]] = $this->getFileType(BusinessModel::TYPE_IMG[1])->first()?->getLink();
            $resource['fullDescription'] = $this->full_description;
            $resource['marketAnalysis'] = $this->market_analysis;
            $resource['financialModel'] = $this->financial_model;
            $resource['currentInvestors'] = $this->current_investors;
            $resource['stagesImplementation'] = $this->stages_implementation;
            $resource['partnershipOptions'] = $this->partnership_options;
            $resource['targetClient'] = $this->target_client;
            $resource['valueProposition'] = $this->value_proposition;
            $resource['revenueLogic'] = $this->revenue_logic;
            $resource['unitEconomics'] = $this->unit_economics;
            $resource['factsHypothesesRisks'] = $this->facts_hypotheses_risks;
            // KPI — Overview
            $resource['kpiGrossMargin']    = $this->kpi_gross_margin;
            $resource['kpiGrossMarginSub'] = $this->kpi_gross_margin_sub;
            $resource['kpiPayback']        = $this->kpi_payback;
            $resource['kpiPaybackSub']     = $this->kpi_payback_sub;
            $resource['kpiLtvCac']         = $this->kpi_ltv_cac;
            $resource['kpiLtvCacSub']      = $this->kpi_ltv_cac_sub;
            $resource['kpiNrr']            = $this->kpi_nrr;
            $resource['kpiNrrSub']         = $this->kpi_nrr_sub;
            $resource['kpiMarket']         = $this->kpi_market;
            $resource['kpiMarketSub']      = $this->kpi_market_sub;
            // KPI — Economics
            $resource['kpiArpa']           = $this->kpi_arpa;
            $resource['kpiArpaSub']        = $this->kpi_arpa_sub;
            $resource['kpiCac']            = $this->kpi_cac;
            $resource['kpiCacSub']         = $this->kpi_cac_sub;
//                $resource['location'] = ValueResource::collection($this->getPropValues('location', null));
//            $resource['available'] = User::AVAILABLE_STATUS[$this->getAvailableStatus()];
//            $resource['allSkills'] = ValueResorce::collection($this->getPropValues('all_skills', null));
//            $resource['userId'] = $this->getNested('user.id');
//            $resource['taxesIncluded'] = (bool) $this->getPropValues('rate');
//            $resource['language'] = $this->getLanguage();
////            $resource['experience'] = $this->getExpirence();
//            $resource['experience'] = $this->experience;
//            $resource['blockExperience'] = UserBlockResorce::collection($this->blockExperience);
//            $resource['educationName'] = $this->getPropValues('education_name');
//            $resource['educationSpecialization'] = $this->getPropValues('education_specialization');
//            $resource['educationDegree'] = $this->getPropValues('education_degree');
//            $resource['educationGraduation'] = $this->getPropValues('education_graduation');
//            $resource['similar'] = self::collection($this->getSimilar());
        }

        return $resource;
    }

    public function getLanguage()
    {
        $result = [];
        $language = Prop::where('id_name', 'language')->first();

        $propsLang = $this->getPropVauesUser()->where('id_parent', $language->id);
        foreach($propsLang as $prop) {
            $result[] = $prop->name . "—" . $prop->values->last()->value;
        }
        return implode("\r\n", $result);
    }

    public static function collection($resource)
    {
        self::$isCollection = true;
        return parent::collection($resource);
    }
}
