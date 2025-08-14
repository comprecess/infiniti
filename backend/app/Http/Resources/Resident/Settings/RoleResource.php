<?php

namespace App\Http\Resources\Resident\Settings;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoleResource extends JsonResource
{

    public function toArray(Request $request): array
    {

        $data =  [
            'id' => $this->id,
            'name' => $this->rname,
//            'access' => RoleAccessResource::collection($this->access),
        ];
        if($this->id){
            $data['access'] = RoleAccessResource::collection($this->access);
        }

        return $data;
    }
}
