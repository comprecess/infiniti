<?php


namespace App\Models\Traits;


use App\Models\Contracts\InsertDefaultValueInterface;

trait InsertDefaultValueTrait
{
    public function insertDefaultValue()
    {
        if(!($this instanceof InsertDefaultValueInterface)) {
            throw new \Exception('The current class does not honor the DefaultValue contract');
        }

        $def = $this->getDefault();

        foreach($def as $column => $data) {
            if(is_array($data)) {
                if(isset($data[1]) && is_array($data[1])) {
                    foreach($data[1] as $val) {
                        $input = request()->input($val);
                    }
                    $this->{$column} = $input ?? $data[0];
                } else {
                    $this->{$column} = request()->input($data[1] ?? $column, $data[0]);
                }
            } else {
                $this->{$column} = $data;
            }

        }
    }

    public static function newDefault()
    {
        $model = new self();
        $model->insertDefaultValue();
        return $model;
    }
}
