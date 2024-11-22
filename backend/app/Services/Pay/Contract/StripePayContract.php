<?php


namespace App\Services\Pay\Contract;


interface StripePayContract
{
    public function stripeSetDate(array $data) :array;
    public function stripeSuccess() :void;
}
