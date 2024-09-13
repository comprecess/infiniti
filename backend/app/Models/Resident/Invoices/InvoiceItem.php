<?php

namespace App\Models\Resident\Invoices;


use App\Models\Collection\InvoiceItemCollection;
use App\Models\Contracts\InsertDefaultValueInterface;
use App\Models\Resident\Settings\Tax;
use App\Models\Traits\CollectionTrait;
use App\Models\Traits\InsertDefaultValueTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class InvoiceItem extends Model implements InsertDefaultValueInterface
{
    use HasFactory, InsertDefaultValueTrait, CollectionTrait;

    const SERVICE = [
        'calc' => null,
        'serviceProduct' => Item::class
    ];

    const DISCOUNT_TYPE = [
        'percent' => 'p',
        'fixed' => 'f'
    ];

    protected $table = "sys_invoiceitems";

    public $collection = InvoiceItemCollection::class;

    public function service()
    {
        return $this->morphTo('service');
    }

    public function getTax()
    {
        return $this->belongsTo(Tax::class, 'tax_rate', 'rate');
    }

    public function invoice()
    {
        return $this->belongsTo(Invoice::class, 'invoiceid');
    }

    public function getDefault(): array
    {
        return [
            'type' => [''],
            'relid' => [0],
            'duedate' => [now()],
            'paymentmethod' => [''],
            'notes' => [''],
            'itemcode' => [''],
        ];
    }

    public function getNameService($nameNull = 'calc')
    {
        $service = array_search($this->service_type, self::SERVICE);
        return $service === false ? $nameNull : $service;
    }

    public function getDiscountType()
    {
        return array_flip(self::DISCOUNT_TYPE)[$this->discount_type ?? 'f'];
    }

    //notService
    public function getSumm()
    {
        return round(intval($this->qty) * $this->amount);
    }

    //notService
    public function getDiscount()
    {
        if(!$this->discount_amount) {
            return 0;
        }

        if($this->discount_type == 'p') {
            $value = $this->discount_amount;
            $value = $value < 0 ? 0 : ($value > 100 ? 100 : $value);
            return $this->getSumm() * ($value * 0.01);
        }

        return $this->discount_amount;
    }

    public function calc()
    {
//        $service = $this->service;
//        $price = $this->amount ?? 0;
//        $amount = $this->qty ? $this->qty : 0;
//        if($service) {
//            $price = $service->getPrice();
//            $this->amo
//        }
//        $priceAmount = round($amount * $price, 2);
//
//        if($this->discount_type == 'p') {
//            $value = $this->discount_amount < 0 ? 0 : ($this->discount_amount > 100 ? 100 : $this->discount_amount);
//        }

        $priceAmount = $this->getSumm();
        $discount = $this->getDiscount();
        $total = round($priceAmount - $discount, 2);

        if($this->tax_rate) {
            $this->taxamount = round($total * ($this->tax_rate * 0.01), 2);
            $total += $this->taxamount;
        }

        $this->total = $total;
    }

}
