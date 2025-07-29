<?php

namespace App\Http\Resources\Catalog;

use App\Http\Resources\Contracts\ListInterface;
use App\Http\Resources\Traits\ListTrait;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PropertyFilterResource extends JsonResource implements ListInterface
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
        if($this->type == 'integer') {
            $resource['values'] = [];
        }else{
            $value = $this->valuesExistsPublic;
//            if(!$value->count()) {
//                return [];
//            }
            $resource['values'] = ValueResorce::collection($value);
        }

        $resource['children'] = self::collection($this->children);
        $resource['options'] = $this->options && !is_array($this->options) ? json_decode($this->options, true) : $this->options;

        return $resource;
    }

    public function getList(): array
    {
        return ['id', 'id_parent' => 'parentId', 'id_name' => 'nameId', 'name', 'type', 'filter', 'options'];
    }
}
