<?php


namespace App\Http\Resources\Traits;


trait ListTrait
{
    protected function setList(&$resource)
    {
        $list = $this->getList();

        foreach($list as $key => $value) {
            if(is_int($key)) {
                $resource[$value] = $this?->{$value};
            }else{
                $resource[$value] = $this?->{$key};
            }
        }
    }
}
