<?php


namespace App\Http\Resources\Contracts;


interface CRUDCollectionContract
{
    public function setData(array $data) :void;
    public function getData() :array;
}
