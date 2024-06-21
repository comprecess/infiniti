<?php


namespace App\Services;


use App\Models\Catalog\Prop;

abstract class FilterProp
{

    public function __construct(
        protected $query,
        protected Prop $prop
    )
    {
    }

}
