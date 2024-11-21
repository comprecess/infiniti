<?php


namespace App\Services\Pay\Contract;


interface PaymentGatewaysContract
{
    public function execute() :PaymentGatewaysContract;
    public function response();
}
