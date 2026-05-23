<?php

namespace App\Http\Requests\Resident\BusinessPlan;

use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use App\Models\BusinessModel\Prop;
use Illuminate\Foundation\Http\FormRequest;

class BusinessModelCreateRequest extends FormRequest implements ConvertingPropertiesInterface
{
    use ConvertingPropertiesTrait;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */

    public function rules(): array
    {
        $props = Prop::whereIn('id_name',['profitability'])->with(['values'])->get();

        $rules = [
            'title' => 'required',
            'description' => 'required',
            'fullDescription' => 'nullable',
            'start' => "nullable|date_format:Y-m-d",
            'industries' => "required",
            'technologies' => "required",
            'price' => "required|numeric|min:0",
            'location' => "required",
            'age' => "required|numeric|min:0",
            'category' => "required",
            'profitability' => "required|in:" . $props->where('id_name', 'profitability')->first()->values->pluck('id')->implode(','),

        ];

        return $rules;
    }


    public function getListProperties(): array
    {
        return [
            'title',
            'description',
            'fullDescription' => 'full_description',
            'start',
            'marketAnalysis' => 'market_analysis',
            'financialModel' => 'financial_model',
            'currentInvestors' => 'current_investors',
            'stagesOfImplementation' => 'stages_implementation',
            'partnershipOptions' => 'partnership_options',
            'targetClient' => 'target_client',
            'valueProposition' => 'value_proposition',
            'revenueLogic' => 'revenue_logic',
            'unitEconomics' => 'unit_economics',
            'factsHypothesesRisks' => 'facts_hypotheses_risks',
            // KPI fields
            'kpiGrossMargin'    => 'kpi_gross_margin',
            'kpiGrossMarginSub' => 'kpi_gross_margin_sub',
            'kpiPayback'        => 'kpi_payback',
            'kpiPaybackSub'     => 'kpi_payback_sub',
            'kpiLtvCac'         => 'kpi_ltv_cac',
            'kpiLtvCacSub'      => 'kpi_ltv_cac_sub',
            'kpiNrr'            => 'kpi_nrr',
            'kpiNrrSub'         => 'kpi_nrr_sub',
            'kpiMarket'         => 'kpi_market',
            'kpiMarketSub'      => 'kpi_market_sub',
            'kpiArpa'           => 'kpi_arpa',
            'kpiArpaSub'        => 'kpi_arpa_sub',
            'kpiCac'            => 'kpi_cac',
            'kpiCacSub'         => 'kpi_cac_sub',
        ];
    }
}
