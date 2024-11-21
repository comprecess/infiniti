<?php


namespace App\Services\Pay\PaymentGateways;

use App\Services\Pay\Contract\PaymentGatewaysContract;
use App\Services\Pay\PaymentGateways;

class Stripe extends PaymentGateways implements PaymentGatewaysContract
{

    public function execute() :PaymentGatewaysContract
    {
        // TODO: Implement execute() method.
    }

    public function response()
    {
        // TODO: Implement response() method.
    }
}
