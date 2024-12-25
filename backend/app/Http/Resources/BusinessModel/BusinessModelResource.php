<?php

namespace App\Http\Resources\BusinessModel;

use App\Http\Resources\Traits\NestedParametersTrait;
use App\Http\Resources\Traits\PropValuesTrait;
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

        $resorce = [
            'id' => $this->id,
            'start' => $this->start?->format('Y-m-d'),
            'description' => $this->description,
//            'img' => $this->getLastFile(true) ?? "",
            'category' => ValueResource::collection($this->getPropValues('category', null)),
            'age' => $this->getPropValues('age'),
            'industries' => ValueResource::collection(self::$isCollection ? ($industries->count() ? $industries?->chunk(3)?->first() : collect([])) : $industries),
            'technologies' => ValueResource::collection(self::$isCollection ? ( $technologies->count() ? $technologies?->chunk(3)?->first() : collect([]) ) : $technologies),
            'price' => $this->getCurrency((int) $this->getPropValues('price')),
        ];

        if(!self::$isCollection) {
//            $resorce['available'] = User::AVAILABLE_STATUS[$this->getAvailableStatus()];
//            $resorce['allSkills'] = ValueResorce::collection($this->getPropValues('all_skills', null));
//            $resorce['userId'] = $this->getNested('user.id');
//            $resorce['taxesIncluded'] = (bool) $this->getPropValues('rate');
//            $resorce['language'] = $this->getLanguage();
////            $resorce['experience'] = $this->getExpirence();
//            $resorce['experience'] = $this->experience;
//            $resorce['blockExperience'] = UserBlockResorce::collection($this->blockExperience);
//            $resorce['educationName'] = $this->getPropValues('education_name');
//            $resorce['educationSpecialization'] = $this->getPropValues('education_specialization');
//            $resorce['educationDegree'] = $this->getPropValues('education_degree');
//            $resorce['educationGraduation'] = $this->getPropValues('education_graduation');
//            $resorce['similar'] = self::collection($this->getSimilar());
        }

        return $resorce;
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
