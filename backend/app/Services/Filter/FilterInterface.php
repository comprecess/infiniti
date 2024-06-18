<?php


namespace App\Services\Filter;


interface FilterInterface
{
    public function before($query, $prop, $value);
    public function after($result);
}
