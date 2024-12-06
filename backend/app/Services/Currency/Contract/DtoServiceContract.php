<?php


namespace App\Services\Currency\Contract;


interface DtoServiceContract
{
    public function setRate(array $curArray) :void;
    public function getList() :array;
    public function getBase() :string;
}
