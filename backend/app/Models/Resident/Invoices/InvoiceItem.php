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
        return array_flip(self::DISCOUNT_TYPE)[$this->discount_type];
    }

    public function getSumm()
    {
        return intval($this->qty) * $this->amount;
    }


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

}
