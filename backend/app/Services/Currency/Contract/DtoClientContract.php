<?php


namespace App\Services\Currency\Contract;


interface DtoClientContract
{
    public function set(string|array $cur) :void;
    public function getRate() :array;
}
