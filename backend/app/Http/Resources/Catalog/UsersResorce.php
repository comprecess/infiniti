<?php

namespace App\Http\Resources\Catalog;

use App\Http\Resources\Traits\NestedParametersTrait;
use App\Http\Resources\Traits\PropValuesTrait;
use App\Http\Resources\UserResource;
use App\Models\Catalog\Prop;
use App\Models\Catalog\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;

class UsersResorce extends JsonResource
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
        $keySkills = $this->getPropValues('key_skills', null);

        $resource = [
            'id' => $this->id,
            'name' => $this->name,
            'img' => $this->getLastFile(true) ?? "",
            'specialization' => $this->getPropValues('specialization'),
            'timezone' => $this->getPropValues('timezone'),
            'level' => $this->getPropValues('lvl'),
            'industries' => ValueResorce::collection(self::$isCollection ? ($industries->count() ? $industries?->chunk(3)?->first() : collect([])) : $industries),
            'keySkills' => ValueResorce::collection(self::$isCollection ? ( $keySkills->count() ? $keySkills?->chunk(3)?->first() : collect([]) ) : $keySkills),
//            'priceDay' => $this->getCurrency((int) $this->getPropValues('priceDay')),
//            'priceHour' => $this->getCurrency((int) $this->getPropValues('priceHour')),
            'priceDay' => $this->printPrice((int) $this->getPropValues('priceDay'), null, " ", 0),
            'priceHour' => $this->printPrice((int) $this->getPropValues('priceHour'), null, " ", 0),
            'inCart' => $this->inCart ? 1 : 0
        ];

        if(!self::$isCollection) {
            $resource['available'] = User::AVAILABLE_STATUS[$this->getAvailableStatus()];
            $resource['allSkills'] = ValueResorce::collection($this->getPropValues('all_skills', null));
            $resource['userId'] = $this->getNested('user.id');
            $resource['taxesIncluded'] = (bool) $this->getPropValues('rate');
            $resource['language'] = $this->getLanguage();
//            $resource['experience'] = $this->getExpirence();
            $resource['experience'] = $this->experience;
            $resource['blockExperience'] = UserBlockResorce::collection($this->blockExperience);
            $resource['educationName'] = $this->getPropValues('education_name');
            $resource['educationSpecialization'] = $this->getPropValues('education_specialization');
            $resource['educationDegree'] = $this->getPropValues('education_degree');
            $resource['educationGraduation'] = $this->getPropValues('education_graduation');
            $resource['similar'] = self::collection($this->getSimilar());
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
