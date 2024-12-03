<?php


namespace App\Services\Pay\Contract;


use App\Services\Pay\Pay;

interface PayModelContract
{
    public function paySetDate(array $data, Pay $pay) :array;
    public function paySuccess(Pay $pay, mixed $result = null) :void;
}
