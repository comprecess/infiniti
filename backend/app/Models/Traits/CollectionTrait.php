<?php


namespace App\Models\Traits;


use Illuminate\Database\Eloquent\Collection;

trait CollectionTrait
{
    public function newCollection(array $models = [])
    {
        return $this->collection ? new $this->collection($models) : new Collection($models) ;
    }
}
