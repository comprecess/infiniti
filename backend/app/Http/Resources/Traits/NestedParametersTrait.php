<?php


namespace App\Http\Resources\Traits;


use Illuminate\Support\Arr;

trait NestedParametersTrait
{
    public function getNested(string|array $nested, $element = null)
    {
        $element = $element ?? $this;

        if(!is_array($nested)) {
            $nested = explode('.', $nested);
        }

        $firstKey = array_key_first($nested);
        $first = Arr::pull($nested, $firstKey);

//        if($first == '*') {
//
//        }
        if(count($nested) && (is_object($element?->{$first}) || is_array($element?->{$first}))) {
            return $this->getNested($nested, is_object($element?->{$first}) ? $element?->{$first} : $element[$first]);
        } else {
            return $element?->{$first};
        }

    }
}
