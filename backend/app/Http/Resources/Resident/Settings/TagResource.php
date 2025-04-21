<?php

namespace App\Http\Resources\Resident\Settings;


use App\Models\Config;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TagResource extends JsonResource
{

    public function toArray(Request $request): array
    {

        return [
            'id' => $this->id,
            'name' => $this->text,
            'type' => $this->type,
        ];
    }

}
