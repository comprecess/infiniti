<?php

namespace App\Http\Resources\Resident\Talents;


use App\Http\Resources\Traits\NestedParametersTrait;
use App\Http\Resources\Traits\PropValuesTrait;
use App\Http\Resources\Traits\ToChatTrait;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TalentChatGPTResource extends JsonResource
{
    use NestedParametersTrait, PropValuesTrait, ToChatTrait;

    public function toArray(Request $request): array
    {
        $filter = ['industries', 'key_skills', 'priceHour', 'timezone', 'english', 'german', 'spanish', 'russian', 'arabic', 'chinese_mandarin', 'lvl', 'specialization', 'all_skills','location'];

        $prop = collect([]);

        foreach($this->values as $value) {
            if(!in_array($value->prop->id_name, $filter)) {
                continue;
            }
            $p = $prop->where('id', $value->prop->id);
            if(!$p->count()) {
                $prop->push(clone $value->prop);
            }

            $prop->where('id', $value->prop->id)->each(function($item) use($value){
               if(!$item->userValue) {
                   $item->userValue = collect([]);
               }
                $item->userValue->push($value);
            });
        }


        $data = [
            'id' => $this->id,
            'name' => $this->name,
            'property' => "\n" . TalentPropChatGPTResource::toChatCollection($prop),
        ];

        return $data;
    }

    public function namesToChat()
    {
        return ['name' => "Имя", 'birthDay' => "День рождения", 'property' => "Свойства/Качество"];
    }

}
