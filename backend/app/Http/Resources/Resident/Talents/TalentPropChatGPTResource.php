<?php

namespace App\Http\Resources\Resident\Talents;


use App\Http\Resources\Catalog\PropertyResorce;
use App\Http\Resources\Catalog\ValueResorce;
use App\Http\Resources\Traits\ToChatTrait;
use Illuminate\Http\Request;

class TalentPropChatGPTResource extends PropertyResorce
{
    use ToChatTrait;

    public function toArray(Request $request): array
    {
        $resource = [];

        $resource[$this->id_name] = $this->userValue?->pluck('value')?->implode(', ');

        return $resource;
    }

    public function namesToChat()
    {
        return [
            'industries' => "\tПромышленности",
            'key_skills' => "\tКлючевые навыки",
            'all_skills' => "\tВсе навыки",
            'priceHour' => "\tПлата в час ($)",
            'timezone' => "\tЧасовой пояс",
            'english' => "\tЗнание языка (английский)",
            'german' =>"\tЗнание языка (немецкий)",
            'spanish' =>"\tЗнание языка (испанский)",
            'russian' =>"\tЗнание языка (русский)",
            'arabic' =>"\tЗнание языка (арабский)",
            'chinese_mandarin' =>"\tЗнание языка (китайский)",
            'lvl' =>"\tУровень",
            'specialization' =>"\tСпециализация",
            'location' =>"\tЛокация",
        ];
    }


}
