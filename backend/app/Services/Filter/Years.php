<?php


namespace App\Services\Filter;


use App\Services\FilterProp;

class Years extends FilterProp implements FilterInterface
{

    public function before($value)
    {
        if(isset($value[0]) && $value[0] !== null) {
            $this->query->where('experience->year', '>=', $value[0]);
        }

        if(isset($value[1]) && $value[1] !== null) {
            $this->query->where('experience->year', '<=', $value[1]);
        }
    }

    public function after($result)
    {
        // TODO: Implement after() method.
    }
}
