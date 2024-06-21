<?php


namespace App\Services\Filter;


interface FilterInterface
{
    public function before($value);
    public function after($result);
}
