<?php

namespace App\Http\Resources\Resident\Talents;


use App\Http\Requests\Traits\TimeZoneTrait;
use App\Http\Resources\Traits\NestedParametersTrait;
use App\Http\Resources\Traits\PropValuesTrait;
use App\Http\Resources\UserResource;
use App\Models\Catalog\Prop;
use App\Models\Config;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartListResource extends JsonResource
{
    use NestedParametersTrait, PropValuesTrait, TimeZoneTrait;

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
            'total' => $this->printPrice('total'),
            'subTotal' => $this->printPrice('sub_total'),
            'subTax' => $this->printPrice('sub_tax'),
            'date' => $this->toTimeZoneClient('updated_at', Config::get('df')),
            'secret' => $this->secret,
            'cartItems' => CartItemResource::collection($this->itemsActive)
        ];
    }

}
