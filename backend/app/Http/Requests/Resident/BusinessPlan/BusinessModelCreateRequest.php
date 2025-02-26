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
            'price' => "required",
            'location' => "required",
            'age' => "required",
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
        ];
    }
}
