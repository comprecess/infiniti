<?php

namespace App\Http\Controllers\Service;


use App\Http\Controllers\Controller;
use App\Services\Pay\Contract\PayContract;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\Webhook;


class StripeController extends Controller
{

    public function index(PayContract $pay, Request $request)
    {
        $stripe = $pay->setPay('stripe');
        $info = $stripe->getInfo();

        $payload = $request->getContent();
        $sig_header = $request->server('HTTP_STRIPE_SIGNATURE');
        $event = null;

        try {
            $event = Webhook::constructEvent(
                $payload, $sig_header, $info->c1
            );
        } catch(\UnexpectedValueException $e) {
            abort(400);
        } catch(\Stripe\Exception\SignatureVerificationException $e) {
            abort(400);
        }

        if (
            $event->type == 'checkout.session.completed'
            || $event->type == 'checkout.session.async_payment_succeeded'
        ) {
            Log::info("*****STRIPE*****", ['id' => $event->data->object->id]);
        }
    }

}
