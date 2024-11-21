<?php


namespace App\Services\Pay;


abstract class PaymentGateways
{

    public function __construct(
        protected Pay $pay
    )
    {
    }

}
