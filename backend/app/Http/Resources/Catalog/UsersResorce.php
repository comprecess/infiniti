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

        $resorce = [
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
            $resorce['available'] = User::AVAILABLE_STATUS[$this->getAvailableStatus()];
            $resorce['allSkills'] = ValueResorce::collection($this->getPropValues('all_skills', null));
            $resorce['userId'] = $this->getNested('user.id');
            $resorce['taxesIncluded'] = (bool) $this->getPropValues('rate');
            $resorce['language'] = $this->getLanguage();
//            $resorce['experience'] = $this->getExpirence();
            $resorce['experience'] = $this->experience;
            $resorce['blockExperience'] = UserBlockResorce::collection($this->blockExperience);
            $resorce['educationName'] = $this->getPropValues('education_name');
            $resorce['educationSpecialization'] = $this->getPropValues('education_specialization');
            $resorce['educationDegree'] = $this->getPropValues('education_degree');
            $resorce['educationGraduation'] = $this->getPropValues('education_graduation');
            $resorce['similar'] = self::collection($this->getSimilar());
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
