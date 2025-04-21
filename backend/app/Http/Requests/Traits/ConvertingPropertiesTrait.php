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

    public function setModel($model, $isPut = false, $listPropertis = null)
    {
        $valuesSet  = [];
        if(method_exists($this, 'getListPropertiesValue')) {
            $valuesSet = $this->getListPropertiesValue();
        }
        foreach ($listPropertis ?? $this->getListProperties() as $key => $val)
        {
            $keyVal = is_int($key) ? $val : $key;
            $value = $this->{$keyVal};

            if(isset($valuesSet[$keyVal])) {
                $value = $valuesSet[$keyVal];
            }
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
