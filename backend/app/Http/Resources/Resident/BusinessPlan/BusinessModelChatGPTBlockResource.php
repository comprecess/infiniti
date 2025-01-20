<?php

namespace App\Http\Resources\Resident\BusinessPlan;


use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BusinessModelChatGPTBlockResource extends JsonResource
{

    public function toArray(Request $request): array
    {

        return [
            'id' => $this->id,
            'type' => $this->type,
            'request' => $this->request,
            'response' => $this->response,
        ];

    }

}
