<?php

namespace App\Http\Resources\BusinessModel;

use App\Http\Resources\Contracts\ListInterface;
use App\Http\Resources\Traits\ListTrait;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ValueResource extends JsonResource implements ListInterface
{
    use ListTrait;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $resource = [];

        $this->setList($resource);

        return $resource;
    }

    public function getList(): array
    {
        return ['id', 'id_prop' => 'propId', 'value'];
    }
}
