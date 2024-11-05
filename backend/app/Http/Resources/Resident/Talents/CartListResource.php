<?php

namespace App\Http\Resources\Resident\Talents;


use App\Http\Resources\Resident\Client\ClientResource;
use App\Http\Resources\Traits\NestedParametersTrait;
use App\Http\Resources\Traits\PropValuesTrait;
use App\Http\Resources\UserResource;
use App\Models\Catalog\Prop;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartListResource extends JsonResource
{
    use NestedParametersTrait, PropValuesTrait;

    protected static $prop = null;

    public function toArray(Request $request): array
    {
        if(!self::$prop) {
            self::$prop = Prop::where('id_name', 'specialization')->first();
        }

        $specializations = collect([]);
        $this->items?->each(function($item) use($specializations){
            $values = $item->userCatalog?->values;
            if($values) {
                $specializations->push($values->where('id_prop', self::$prop->id)->first());
            }
        });

        return [
            'id' => $this->id,
            'user' => new UserResource($this->user),
            'specializations' => $specializations->pluck('value')->implode(', '),
            'total' => $this->total,
            'subTotal' => $this->sub_total,
            'subTax' => $this->sub_tax,
            'date' => $this->updated_at->format('d/m/Y'),
            'secret' => $this->secret,
            'cartItems' => CartItemResource::collection($this->items)
        ];
    }

}
