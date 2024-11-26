<?php
//https://docs.stripe.com/payment-links/api

namespace App\Services\Pay\PaymentGateways;

use App\Models\Resident\Settings\Currency;
use App\Services\Pay\Contract\PaymentGatewaysContract;
use App\Services\Pay\Contract\StripePayContract;
use App\Services\Pay\PaymentGateways;
use Illuminate\Support\Facades\Log;
use \Stripe as StripeLibrary;

class StripeLink extends PaymentGateways implements PaymentGatewaysContract
{

    protected $link = null;

    public function execute() :PaymentGatewaysContract
    {
        $model = $this->pay->getModel();
        $info = $this->pay->getInfo();
        $code = $model->getCode();

        $currency = $model->getCurrencyIso ?? Currency::getDefault();

        try {

            StripeLibrary\Stripe::setApiKey($info->c1);

//            dd(StripeLibrary\PaymentLink::all());
//            dd(StripeLibrary\PaymentLink::allLineItems('plink_1QOCf22eZvKYlo2Cjl4xxOHR'));

            $product = StripeLibrary\Product::create([
                'name' => $code,
            ]);

            $price = StripeLibrary\Price::create([
                'currency' => strtolower($currency->iso_code),
                'product' => $product->id,
                'unit_amount' => (int)round($model->getDueAmount()) * 100,
            ]);

            $link = StripeLibrary\PaymentLink::create([
                'line_items' => [
                    [
                        'price' => $price->id,
                        'quantity' => 1,
                    ],
                ],
                'after_completion' => [
                    'type' => 'redirect',
                    'redirect' => ['url' => frontLink("/public/invoice/view/{$model->vtoken}")  /*$this->pay->getDataRequest()->fullUrl()*/],
                ],
            ]);

//            StripeLibrary\PaymentLink::allLineItems()

            $this->link = $link->url;
        }catch (\Exception $e) {
            Log::error($e->getMessage(), $e->getTrace());
        }

        return $this;
    }

    public function response()
    {
        return response()->json(['success' => $this->link ? true : false, 'url' => $this->link]);
    }
}
