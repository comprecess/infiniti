<?php
namespace App\Http\Requests\Traits;

trait ConvertingPropertiesTrait
{

    public function conversion()
    {
        foreach ($this->getListProperties() as $key => $val)
        {
            $value = is_int($key) ? $this->{$val} : $this->{$key};
            $this->{$val} = $value;
        }
    }

    public function setModel($model)
    {
        foreach ($this->getListProperties() as $key => $val)
        {
            $value = is_int($key) ? $this->{$val} : $this->{$key};
            $model->{$val} = $value;
        }
    }
}
