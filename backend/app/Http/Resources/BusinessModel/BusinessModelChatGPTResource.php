<?php

namespace App\Http\Resources\BusinessModel;

use App\Http\Resources\Traits\NestedParametersTrait;
use App\Http\Resources\Traits\PropValuesTrait;
use App\Http\Resources\Traits\ToChatTrait;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BusinessModelChatGPTResource extends JsonResource
{
    use NestedParametersTrait, PropValuesTrait, ToChatTrait;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */

    public static $isCollection = false;

    public function toArray(Request $request): array
    {
        $data = ['title', 'price', 'description', 'category', 'industries', 'technologies', 'location', 'full_description', 'market_analysis', 'financial_model', 'current_investors', 'stages_implementation', 'partnership_options'];
        $resource = [];
        foreach($data as $key => $value) {
            $key = is_int($key) ? $value : $key;
            if($this->{$value}) {
                $resource[$key] = $this->{$value};
            }else{
                $prop = $this->getPropValues($value, null);
                if($prop->count()) {
                    $resource[$key] = $prop->pluck('value')->implode(', ');
                }
            }
        }

        return $resource;
    }

//    public function toChat(mixed $data = null) :string
//    {
//        $data = $data ?? [];
//        $result = $this->jsonSerialize();
//        $resultArray = [];
//        foreach($result as $key => $value) {
//            $resultArray[] = Arr::get($data, "{$key}.parse.0", $key) . ": " . $value;
//        }
//
//        return implode("\n", $resultArray);
//    }

    public function namesToChat()
    {
        return [
            'price' => 'Цена'
        ];
    }



}
