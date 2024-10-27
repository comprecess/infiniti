<?php

namespace App\Http\Resources\Resident\Talents;


use App\Http\Resources\Catalog\PropertyResorce;
use App\Http\Resources\Catalog\ValueResorce;
use Illuminate\Http\Request;

class TalentPropResource extends PropertyResorce
{

    public function toArray(Request $request): array
    {
        $resource = [];

//        $this->setList($resource);
//        $resource['values'] = ValueResorce::collection($this->userValue);
        //or
        $resource[snakeCaseToPascalCase($this->id_name)] = ValueResorce::collection($this->userValue);



        return $resource;
    }


}
