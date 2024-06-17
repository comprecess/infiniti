<?php

namespace App\Http\Resources\Catalog;

use App\Http\Resources\Traits\NestedParametersTrait;
use App\Http\Resources\Traits\PropValuesTrait;
use App\Http\Resources\UserResource;
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

    protected $props = null;

    public function toArray(Request $request): array
    {

        $resorce = [
            'id' => $this->id,
            'name' => $this->getNested('user.account'),
            'img' => $this->getNested('user.img'),
            'specialization' => $this->getPropValues('specialization1'),
            'timezone' => $this->getPropValues('timezone'),
            'level' => $this->getPropValues('lvl'),
            'industries' => ValueResorce::collection($this->getPropValues('industries', null)->chunk(3)->first()),
            'keySkills' => ValueResorce::collection($this->getPropValues('key_skills', null)->chunk(3)->first()),
            'priceDay' => $this->getPropValues('priceDay'),
            'priceHour' => $this->getPropValues('priceHour'),
//            'available' => $this->getAvailable(),
//            'user' => new UserResource($this->user),
//            'properties' => PropertyUserResorce::collection($this->getTreePropValuesCollection()),
//            'experience' => $this->getExpirence(),
//            'blockExperience' => UserBlockResorce::collection($this->blockExperience)
        ];

        return $resorce;
    }
}
