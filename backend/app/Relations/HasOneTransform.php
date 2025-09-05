<?php
namespace App\Relations;


use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class HasOneTransform extends HasOne
{

    public function addConstraints()
    {

        if (static::$constraints) {
            $query = $this->getRelationQuery();

            foreach($this->foreignKey as $key => $foreign) {

                $query->where(function($q) use($key, $foreign){

                    if(is_callable($callable = $this->localKey[$key])) {
                        $data = $callable($this->parent);
                    }else{
                        $data = $this->parent->getAttribute($callable);
                    }

                    $q->where($foreign, '=', $data);
                    $q->whereNotNull($foreign);
                });
            }
        }
    }

    public function getResults()
    {
        return $this->query->first() ?: $this->getDefaultFor($this->parent);
    }

    public function addEagerConstraints(array $models)
    {
        foreach($this->localKey as $key => $local) {
            $whereIn = $this->whereInMethod($this->parent, $local);

            $this->whereInEager(
                $whereIn,
                $this->foreignKey[$key],
                $this->getKeys($models, $local),
                $this->getRelationQuery()
            );
        }

    }

    protected function whereInMethod(Model $model, $key)
    {
        if(is_callable($key)) {
            return 'whereIn';
        }

        return $model->getKeyName() === last(explode('.', $key))
        && in_array($model->getKeyType(), ['int', 'integer'])
            ? 'whereIntegerInRaw'
            : 'whereIn';
    }


    protected function getKeys(array $models, $key = null)
    {
        return collect($models)->map(function ($value) use ($key) {
            if(is_callable($key)) {
                return $key($value);
            }

            return $key ? $value->getAttribute($key) : $value->getKey();
        })->values()->unique(null, true)->sort()->all();
    }


    protected function matchOneOrMany(array $models, Collection $results, $relation, $type)
    {
        foreach ($models as $model) {
            $modelResult = clone $results;
            foreach($this->localKey as $i => $key){
                if(is_callable($key)) {
                    $data = $key($model);
                }else{
                    $data = $model->getAttribute($key);
                }
                $modelResult = $modelResult->where($this->foreignKey[$i], $data);
            }

            $model->setRelation(
                $relation, $type == 'one' ? $modelResult->first() : $this->related->newCollection($modelResult)
            );
        }

        return $models;
    }

    protected function buildDictionary(Collection $results)
    {

        $foreign = $this->getForeignKeyName();

        return $results->mapToDictionary(function ($result) use ($foreign) {
            return [$this->getDictionaryKey($result->{$foreign}) => $result];
        })->all();
    }

    public function getForeignKeyName()
    {

        $segments = explode('.', $this->getQualifiedForeignKeyName());

        return end($segments);
    }

    public function getQualifiedForeignKeyName()
    {
        return $this->foreignKey[0];
    }

    /*public function getParentKey()
    {
        if(is_callable($callable = $this->localKey)) {
            return $callable($this->parent);
        }
        return $this->parent->getAttribute($this->localKey);
    }*/

}
