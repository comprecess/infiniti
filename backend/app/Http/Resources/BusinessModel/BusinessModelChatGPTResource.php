<?php

namespace App\Http\Resources\BusinessModel;

use App\Http\Resources\Traits\NestedParametersTrait;
use App\Http\Resources\Traits\PropValuesTrait;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Arr;

class BusinessModelChatGPTResource extends JsonResource
{
    use NestedParametersTrait, PropValuesTrait;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */

    public static $isCollection = false;

    public function toArray(Request $request): array
    {
       $name = get_class($this->resource);

        $data = ['title', 'description', 'category', 'industries', 'technologies', 'location', 'full_description', 'market_analysis', 'financial_model', 'current_investors', 'stages_implementation', 'partnership_options'];
        $resorce = [];
        foreach($data as $key => $value) {
            $key = is_int($key) ? $value : $key;
            if($this->{$value}) {
                $resorce[$key] = $this->{$value};
            }else{
                $prop = $this->getPropValues($value, null);
                if($prop->count()) {
                    $resorce[$key] = $prop->pluck('value')->implode(', ');
                }
            }
        }

        return $resorce;
    }

    public function toChat(mixed $data = null) :string
    {
        $data = $data ?? [];
        $result = $this->jsonSerialize();
        $resultArray = [];
        foreach($result as $key => $value) {
            $resultArray[] = Arr::get($data, "{$key}.parse.0", $key) . ": " . $value;
        }

        return implode("\n", $resultArray);
    }



}
