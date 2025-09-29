<?php

namespace App\Http\Resources\Client\BusinessPlan;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuestionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $child = $this->childrenRecursive;
        return[
            'id' => $this->id,
            'type' => $this->type,
//            'title' => $this->title,
            'description' => __("{$this->key_lang}.text"),
            'position' => $this->position,
            'field' => $this->field,
            'child' => $child->count() ? QuestionResource::collection($child) : null,
        ];
    }


}
