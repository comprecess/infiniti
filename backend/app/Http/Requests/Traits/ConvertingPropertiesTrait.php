<?php
namespace App\Http\Requests\Traits;

trait ConvertingPropertiesTrait
{

//    public function conversion()
//    {
//        foreach ($this->getListProperties() as $key => $val)
//        {
//            $value = is_int($key) ? $this->{$val} : $this->{$key};
//            if(!is_null($value)) {
//                $this->{$val} = $value;
//            }
//        }
//    }

    public function conversion()
    {
        $list = $this->getListProperties();
        foreach ($this->all() as $key => $val)
        {
            $key = $list[$key] ?? $key;
            $this->{$key} = $val;
        }
    }

//    public function setModel($model)
//    {
//        foreach ($this->getListProperties() as $key => $val)
//        {
//            $value = is_int($key) ? $this->{$val} : $this->{$key};
//            if(!is_null($value)) {
//                $model->{$val} = $value;
//            }
//        }
//    }

    public function setModel($model)
    {
        $list = $this->getListProperties();
        foreach ($this->all() as $key => $val)
        {
            $key = $list[$key] ?? $key;
            $model->{$key} = $val;
        }
    }
}
