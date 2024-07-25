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

    public function setModel($model, $isPut = false)
    {
        foreach ($this->getListProperties() as $key => $val)
        {
            $value = is_int($key) ? $this->{$val} : $this->{$key};
            if($isPut) {
                if(!is_null($value)) {
                    $model->{$val} = $value;
                }
            } else {
                $model->{$val} = $value;
            }
        }
    }
}
