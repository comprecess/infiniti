<?php


namespace App\Services\Pay\Contract;


use Illuminate\Database\Eloquent\Model;

interface PayContract
{
    public function setPay(string $name, Model $model) :PayContract;
}
