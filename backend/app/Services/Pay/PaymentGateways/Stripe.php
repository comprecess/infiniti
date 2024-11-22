<?php


namespace App\Services\Pay\PaymentGateways;

use App\Services\Pay\Contract\PaymentGatewaysContract;
use App\Services\Pay\Contract\StripePayContract;
use App\Services\Pay\PaymentGateways;
use Illuminate\Support\Facades\Log;
use \Stripe as StripeLibrary;

class Stripe extends PaymentGateways implements PaymentGatewaysContract
{
    private $chargeData = [
        'amount' => null,
        'currency' => null,
        'description' => null,
        'source' => null,
        'capture' => true,
    ];

    public function execute() :PaymentGatewaysContract
    {
        $request = $this->pay->getDataRequest();
        $data = $this->chargeData;
        $info = $this->pay->getInfo();
        $data['source'] = $request->token;
        $model = $this->pay->getModel();
        if($model instanceof StripePayContract) {
            $data = $model->stripeSetDate($data);
        }else{
            throw new \Exception("Model not found");
        }

        StripeLibrary\Stripe::setApiKey($info->c1);
        $charge = StripeLibrary\Charge::create($data);

        Log::alert(var_export($charge));

        if (isset($charge->status) && $charge->status == 'succeeded') {
            $model->stripeSuccess();
        }

        return $this;
    }

    public function response()
    {
        return response()->json(['success' => true]);
    }
}
