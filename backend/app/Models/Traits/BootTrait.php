<?php


namespace App\Models\Traits;


trait BootTrait
{
    public static function boot() {
        parent::boot();
        /**
         * Write code on Method
         *
         * @return response()
         */
        $methods = ['creating', 'created', 'updating', 'updated', 'deleted'];
        foreach ($methods as $method){
            if(method_exists(static::class, $method . "Event")) {
                static::{$method}(function($item) use($method){
                    return static::{$method . "Event"}($item);
                });
            }
        }
    }
}
