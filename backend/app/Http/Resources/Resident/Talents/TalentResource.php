<?php

namespace App\Http\Resources\Resident\Talents;


use App\Http\Resources\Traits\NestedParametersTrait;
use App\Http\Resources\Traits\PropValuesTrait;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TalentResource extends JsonResource
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
            'name' => $this->name,
            'img' => $this->getLastFile(true) ?? "",
//            'client' => new ClientResource($this->user),
            'birthDay' => $this->birth_day?->format('Y-m-d'),
            'active' => $this->active ? 1 : 0,
            'property' => TalentPropResource::collection($prop),
            'blockExperience' => BlockExperienceResorce::collection($this->blockExperience)
        ];
        foreach(['specialization', 'priceHour', 'priceDay'] as $idName) {
            $data[$idName] = $this->getPropValues($idName);
        }

        return $data;
    }

}
