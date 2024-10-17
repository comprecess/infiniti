<?php


namespace App\Http\Requests\Traits;


trait SortModel
{

    public function sortModel($model)
    {
        $sort = $this->sort();
        $desc = isset($this->sort['type']) ? (bool) $this->sort['type'] : true;
        if(method_exists($this, $sort[$this->sort['name'] ?? array_key_first($sort)])) {
            $method = $sort[$this->sort['name'] ?? 'id'];
            $model->orderBy($this->{$method}(), $desc ? "desc" : 'asc');
        } else {
            $model->orderBy($sort[$this->sort['name'] ?? array_key_first($sort)], $desc ? "desc" : 'asc');
        }
    }

}
