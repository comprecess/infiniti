<?php

namespace App\Http\Requests\Resident\Talents;

use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use App\Models\Catalog\Prop;
use Illuminate\Foundation\Http\FormRequest;

class TalentCreateRequest extends FormRequest implements ConvertingPropertiesInterface
{
    use ConvertingPropertiesTrait;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */

    public function rules(): array
    {
        $props = Prop::whereIn('id_name',['lvl', 'gender', 'timezone'])->get();
        $lang = [];
        Prop::where('id_name', 'language')->first()->children->each(function($propItem) use(&$lang){
            $propItem->values->each(function($valueItem) use(&$lang){
                $lang[] = $valueItem->id;
            });
        });

        $rules = [
            'name' => 'required',
            'email' => 'nullable|email',
//            'clientId' => 'required|integer|exists:crm_accounts,id',
//            'ownerId' => 'required|integer|exists:sys_users,id',
            'specialization' => "required",
            'timezone' => "required|in:" . $props->where('id_name', 'timezone')->first()->values->pluck('id')->implode(','),
            'lvl' => "required|in:" . $props->where('id_name', 'lvl')->first()->values->pluck('id')->implode(','),
            'industries' => "required",
            'keySkills' => "required",
            'priceDay' => "required|numeric|min:0",
            'priceHour' => "required|numeric|min:0",
            'allSkills' => "required",
            'gender' => "required|in:" . $props->where('id_name', 'gender')->first()->values->pluck('id')->implode(','),
            'rate' => "nullable|boolean",
//            'language' => "required|in:" . implode(',', $lang),
            'language' => "required",
//            'blockExperience' => "required",
            'educationName' => "required",
            'educationSpecialization' => "required",
            'educationDegree' => "required",
            'educationGraduation' => "required",
            'active' => "required|boolean",
            'birthDay' => "nullable|date_format:Y-m-d",
            'file' => 'nullable|image',
        ];

        return $rules;
    }


    public function getListProperties(): array
    {
        return [
            'name',
            'email',
            'active',
            'ownerId' => 'id_admin',
            'clientId' => 'id_client',
            'birthDay' => 'birth_day',
        ];
    }
}
