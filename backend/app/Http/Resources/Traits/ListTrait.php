<?php


namespace App\Http\Resources\Traits;


trait ListTrait
{
    protected function setList(&$resorce)
    {
        $list = $this->getList();

        foreach($list as $key => $value) {
            if(is_int($key)) {
                $resorce[$value] = $this?->{$value};
            }else{
                $resorce[$value] = $this?->{$key};
            }
        }
    }
}
