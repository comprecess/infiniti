<?php

namespace App\Models\Resident\Invoices;


use App\Http\Requests\Resident\Invoices\InvoicePriceCalcRequest;
use App\Models\Collection\InvoiceItemCollection;
use App\Models\Contracts\InsertDefaultValueInterface;
use App\Models\Resident\Settings\Tax;
use App\Models\Traits\CollectionTrait;
use App\Models\Traits\InsertDefaultValueTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\ValidationException;


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

    protected $casts = [
        'amount' => 'float',
    ];

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

    public function document()
    {
        return $this->morphTo( 'document');
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
            'taxed' => [0],
            'invoiceid' =>[0],
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

    public static function blankCalc(InvoicePriceCalcRequest $request)
    {
        $result = [];
        $sum = [0,0,0,0];
        foreach($request->getPriceList() ?? [] as $key => $value) {
            $class = InvoiceItem::SERVICE[$value['service']];
            $a = intval($value['amount'] ?? 0);
            $p = (float) ($value['price'] ?? 0);
            if(class_exists($class) && $p == 0) {
                $priceModel = $class::findOrFail($value['serviceId']);
                $p = $priceModel->getPrice();
            }

            $price = round($a * $p, 2);
            $discount =  round($request->discount($price, $value['discountType'] ?? null, $value['discount'] ?? null), 2);

            $total = round($price - $discount, 2);

            if(isset($value['tax'])) {
                $taxModel = Tax::findOrFail($value['tax']);
                $tax = $taxModel->getTaxPrice($total);
                $taxRate = $taxModel->rate;
            } else {
                $tax = 0;
                $taxRate = 0;
            }

            $total += $tax;
            $result[$key]['service'] = $value['service'];
            $result[$key]['serviceId'] = $value['serviceId'] ?? null;
            $result[$key]['id'] = $value['id'] ?? null;
            $result[$key]['total'] = $total;
            $result[$key]['price'] = $p;
            $result[$key]['amount'] = $a;
            $result[$key]['tax'] = $tax;
            $result[$key]['taxRate'] = $taxRate;
            $result[$key]['discountType'] = $value['discountType'] ?? null;
            $result[$key]['discountValue'] = $value['discount'] ?? null;
            $result[$key]['discountTotal'] = $discount;
            $result[$key]['description'] = $value['description'] ?? $description ?? null;

            $sum[0] += $price;
            $sum[1] += $discount;
            $sum[2] += $tax;
            $sum[3] += $total;

        }

        return [$sum, $result];
    }

    public static function createOrUpdate(InvoicePriceCalcRequest $request, $model)
    {
        list($sum, $result) = self::blankCalc($request);

        foreach($result as $value) {
            if($value['id']) {
                $invoiceItem = $model->items()->where('id', $value['id'])->first();
                if(!$invoiceItem) {
                    throw ValidationException::withMessages([$request->getPriceList(false) . ".id" => __('validation.regex', ['attribute' => $value['id']])]);
                }
            } else {
                $invoiceItem = new InvoiceItem();
            }
            $invoiceItem->insertDefaultValue();
            $invoiceItem->document_type = $model::class;
            $invoiceItem->document_id = $model->id;
            $invoiceItem->invoiceid = $model->id;
            $invoiceItem->userid = $request->clientId;
            $invoiceItem->description = $value['description'] ?? '';
            $invoiceItem->qty = $value['amount'];
            $invoiceItem->amount = $value['price'];
            $invoiceItem->total = $value['total'];
            $invoiceItem->tax_rate = $value['taxRate'];
            $invoiceItem->taxamount = $value['tax'];
            if($value['tax']) {
                $invoiceItem->taxed = 1;
            }else{
                $invoiceItem->taxed = 0;
            }
            $invoiceItem->discount_type = $value['discountType'] == 'percent' ? 'p' : 'f';
            $invoiceItem->discount_amount = $value['discountValue'] ?? 0;
            $invoiceItem->itemcode = $value['serviceId'] ?? '';

            if(isset($value['serviceId']) && isset($value['service'])) {
                $invoiceItem->service_type = InvoiceItem::SERVICE[$value['service']];
                $priceModel = $invoiceItem->service_type::findOrFail($value['serviceId']);
                $invoiceItem->service_id = $value['serviceId'];
                $invoiceItem->amount = $priceModel->getPrice();
            }
            $invoiceItem->save();
        }
    }

}
