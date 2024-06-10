<?php

namespace App\Http\Resources\Catalog;

use App\Http\Resources\Contracts\ListInterface;
use App\Http\Resources\Traits\ListTrait;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PropertyUserResorce extends PropertyResorce
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $resource = [];

        $this->setList($resource);

        $resource['children'] = PropertyUserResorce::collection($this?->childTree ?? collect([]));
        $resource['value'] = ValueResorce::collection($this?->valueTree ?? collect([]));

        return $resource;
    }
}
