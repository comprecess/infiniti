<?php


namespace App\Models\MultipleConditions;


use Illuminate\Database\Eloquent\Model;

abstract class MultipleConditions
{

    protected $methods = null;

    public function make(Model $model, string $column)
    {
        $methods = $this->methods ?? $this->getConditionMethods();
        if(isset($methods[$model->{$column}])) {
            $method = $methods[$model->{$column}];
            if (method_exists($this, $method)) {
                return $this->{$method}($model);
            }
        }

        return null;
    }

    public function setMethods(array $methods)
    {
        $data = [];
        foreach($methods as $method => $status) {
            $m = is_int($method) ? preg_replace('/[^a-zA-Z\d]/ui', '',$status ) : $method;
            $data[$status] = $m;
        }

        $this->methods = $data;
        return $this;
    }

    public function getConditionMethods() :array
    {
        return [];
    }
}
