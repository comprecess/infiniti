<?php
namespace App\Relations;


use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HasManyTransform extends HasMany
{

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
        $dictionary = $this->buildDictionary($results);


        foreach ($models as $model) {
            if(is_callable($callable = $this->localKey)) {

                if(isset($dictionary[$key = $callable($model)])){
                    $model->setRelation(
                        $relation, $this->getRelationValue($dictionary, $key, $type)
                    );
                }
            }
            elseif (isset($dictionary[$key = $this->getDictionaryKey($model->getAttribute($this->localKey))])) {
                $model->setRelation(
                    $relation, $this->getRelationValue($dictionary, $key, $type)
                );
            }
        }

        return $models;
    }

    public function getParentKey()
    {
        if(is_callable($callable = $this->localKey)) {
            return $callable($this->parent);
        }
        return $this->parent->getAttribute($this->localKey);
    }
}
