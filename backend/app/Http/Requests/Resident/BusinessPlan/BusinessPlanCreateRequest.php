<?php

namespace App\Http\Requests\Resident\BusinessPlan;


use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use App\Models\FileStorage;
use Illuminate\Foundation\Http\FormRequest;

class BusinessPlanCreateRequest extends FormRequest implements ConvertingPropertiesInterface
{

    use ConvertingPropertiesTrait;

    public function rules(): array
    {
        return [
            'companyName' => "required|string",
            'exSummary' => "required|string",
            'date' => "nullable|date_format:Y-m-d",
        ];
    }

    public function getListProperties(): array
    {
        return [
            'companyName' =>'company_name',
            'name',
            'email',
            'phone',
            'date',
            'website',
            'description',
            'exSummary' => 'ex_summary',
            'mAnalysis' => 'm_analysis',
            'management',
            'product',
            'marketing',
            'budget',
            'investment',
            'finance',
            'appendix',
        ];
    }
}
