<?php


namespace App\Services\Pay;


use App\Models\Resident\Settings\PaymentGateway;
use App\Services\Pay\Contract\PayContract;
use App\Services\Pay\Contract\PaymentGatewaysContract;
use App\Services\Pay\PaymentGateways\ManualPayment;
use App\Services\Pay\PaymentGateways\Stripe;
use App\Services\Pay\Request\ManualPaymentRequest;
use App\Services\Pay\Request\StripeRequest;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\ValidationException;

class Pay implements PayContract
{

    const PAY_LIST = [
        'manualpayment' => [
            'class' => ManualPayment::class,
            'request' => ManualPaymentRequest::class
        ],
        'stripe' => [
            'class' => Stripe::class,
            'request' => StripeRequest::class
        ],
    ];

    private $payMethod = null;
    private $model = null;

    public function setPay(string $name, Model $model) :PayContract
    {
        if(in_array($name, array_keys(self::PAY_LIST))) {
            $this->payMethod = $name;
        } else {
            throw ValidationException::withMessages(["payType" => __('pay.notFound', ['name' => $name])]);
        }

        $this->model = $model;

        return $this;
    }

    private function getDataList()
    {
        return self::PAY_LIST[$this->payMethod];
    }

    public function getModel()
    {
        return $this->model;
    }

    public function getDataRequest()
    {
        $data = $this->getDataList();
        return app($data['request']);
    }

    public function getInfo() :Model
    {
        return PaymentGateway::where('processor', $this->payMethod)->first();
    }

    public function execute()
    {
        $data = $this->getDataList();
        $gateway = new $data['class']($this);
        if($gateway instanceof PaymentGatewaysContract) {
            return $gateway->execute()->response();
        }
    }

    public function getValueInfo()
    {
        return $this->getInfo()->value;
    }
}
