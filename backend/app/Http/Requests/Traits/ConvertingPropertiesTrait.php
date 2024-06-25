<?php
namespace App\Http\Requests\Traits;

trait ConvertingPropertiesTrait
{

    public function conversion()
    {
        foreach ($this->getListProperties() as $key => $val)
        {
            if(is_int($key)) {
                $this->{$val} = $this->{$val};
            } else {
                $this->{$val} = $this->{$key};
            }
        }
    }

    public function setModel($model)
    {
        foreach ($this->getListProperties() as $key => $val)
        {
            if(is_int($key)) {
                $model->{$val} = $this->{$val};
            } else {
                $model->{$val} = $this->{$key};
            }
        }
    }
}
