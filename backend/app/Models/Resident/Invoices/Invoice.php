<?php

namespace App\Models\Resident\Invoices;

use App\Http\Requests\Resident\Invoices\InvoiceRequest;
use App\Models\Collection\InvoiceCollection;
use App\Models\Config;
use App\Models\Contracts\InsertDefaultValueInterface;
use App\Models\Resident\Transactions\Transaction;
use App\Models\Traits\CollectionTrait;
use App\Models\Traits\CurrencyTrait;
use App\Models\Traits\DocumentTrait;
use App\Models\Traits\HelperTrait;
use App\Models\Traits\InsertDefaultValueTrait;
use App\Models\Traits\UserTrait;
use App\Models\Users\Client;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class Invoice extends Model implements InsertDefaultValueInterface
{
    use HasFactory, CurrencyTrait, CollectionTrait, HelperTrait, InsertDefaultValueTrait, SoftDeletes, UserTrait, DocumentTrait;

    const STATUS = [
        'Unpaid', 'Paid', 'Partially Paid', 'Cancelled'
    ];

    const REPEAT = [
//        [null, 0],
        ['day', 1],
        ['week', 1],
        ['week', 2],
        ['week', 3],
        ['week', 4],
        ['month', 1],
        ['month', 2],
        ['month', 3],
        ['month', 6],
        ['year', 1],
        ['year', 2],
        ['year', 3]
    ];

    protected $table = "sys_invoices";

    protected $adminColumn = 'aid';

    public $collection = InvoiceCollection::class;

    protected $casts = [
      'date' => 'date',
      'duedate' => 'date',
    ];

    public function getCode()
    {
        return $this->invoicenum . ($this->cn ? $this->cn : $this->id);
    }

    public function user()
    {
        return $this->belongsTo(Client::class, 'userid')->withTrashed();
    }

//    public function items()
//    {
//        return $this->hasMany(InvoiceItem::class, 'invoiceid');
//    }

    public function items()
    {
        return $this->morphMany(InvoiceItem::class, 'document');
    }

    public function offer()
    {
        return $this->belongsTo(Offer::class, 'quote_id');
    }

    public function transaction()
    {
        return $this->hasMany(Transaction::class, 'iid');
    }

    public function setCheckPublicAttribute($value)
    {
        $this->attributes['check_public'] = $value ? 1 : 0;
    }

    public static function smallStat(callable $where = null, $round = 1)
    {
        $result = [];

        foreach(self::STATUS as $key => $status) {
            $invoice = self::where('status', $status)->checkAccess();
            if(is_callable($where)) {
                $where($invoice);
            }
            $data = [
                'status' => $status,
                'build' => clone $invoice,
                'count' => $invoice->count(),
            ];

            $result[$key] = $data;
        }

        $summ = array_sum(Arr::pluck($result, 'count'));

        foreach($result as &$data) {
            $data['percentage'] = $data['count'] ? round(($data['count'] / $summ) * 100, $round) : 0 ;
        }
        return $result;
    }
    public static function getRepeatName()
    {
        $repeat = [];
        foreach(self::REPEAT as $key => $value) {
            $repeat[$key] = $value[0] ? trans_choice("numerals.repeat.{$value[0]}", $value[1], [$value[0] => $value[1]]) : $value[1] ;
        }

        return $repeat;
    }

    public function getDefault(): array
    {
        foreach(['vtoken', 'ptoken'] as $name) {
            $this->setRandomNum($name, 10, true);
        }

        return [
            'notes' => ['', 'notes'],
            'account' => [''],
            'taxname' => [''],
            'tax2' => [0.0],
            'taxrate' => [0.0],
            'taxrate2' => [0.0],
            'paymentmethod' => [''],
            'status' => [self::STATUS[0]],
            'r' => ['0'],
            'aid' =>[auth()->id()]
        ];
    }

    public function getKeyRepeat()
    {
        foreach(self::REPEAT as $key => $repeat) {
            $name = "+" . $repeat[1] . " " . $repeat[0];
            if($this->r == $name) {
                return $key;
            }
        }
        return null;
    }

    public function getDueDate()
    {
        if($this->duedate == $this->date) {
            return null;
        }
        $search = array_search($this->date->diff($this->duedate)->days, InvoiceRequest::DUEDATE);

        return $search === false ? null : $search;
    }

    public function blockEdit()
    {
        return in_array($this->status, [self::STATUS[2], self::STATUS[3]]);
    }

    public function duty()
    {
        if($this->credit) {
            return $this->total - $this->credit;
        }

        return $this->credit;
    }

}
