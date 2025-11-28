<?php

namespace App\Models\Resident\Invoices;

use App\Events\Invoice\InvoiceIsPay;
use App\Models\Collection\InvoiceCollection;
use App\Models\Config;
use App\Models\Contracts\InsertDefaultValueInterface;
use App\Models\Resident\Project\Project;
use App\Models\Resident\Settings\Currency;
use App\Models\Resident\Transactions\Transaction;
use App\Models\Traits\BootTrait;
use App\Models\Traits\CollectionTrait;
use App\Models\Traits\CurrencyTrait;
use App\Models\Traits\DocumentTrait;
use App\Models\Traits\HelperTrait;
use App\Models\Traits\InsertDefaultValueTrait;
use App\Models\Traits\ModelToCartTrait;
use App\Models\Traits\UserTrait;
use App\Models\User;
use App\Models\Users\Client;
use App\Services\Pay\Contract\PayModelContract;
use App\Services\Pay\Pay;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class Invoice extends Model implements InsertDefaultValueInterface, PayModelContract
{
    use HasFactory, CurrencyTrait, CollectionTrait, HelperTrait, InsertDefaultValueTrait, SoftDeletes, UserTrait, DocumentTrait, ModelToCartTrait, BootTrait;

    const STATUS = [
        'Unpaid', 'Paid', 'Partially Paid', 'Cancelled'
    ];

    const DUEDATE = [
        3, 5, 7, 10, 15, 30, 45, 60
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

    public $clientColumn = 'userid';

    protected $table = "sys_invoices";

    protected $adminColumn = 'aid';

    protected $documentName = 'invoice';

    public $collection = InvoiceCollection::class;

    protected $casts = [
      'date' => 'date',
      'duedate' => 'date',
      'credit' => 'float',
      'total' => 'float',
    ];

    public static function updatedEvent($item)
    {
        //create project
        //!$item->pid - заглушка от бесконечного цикла
        if($item->status == self::STATUS[1] && !$item->pid) {
            event(new InvoiceIsPay($item));
        }
    }

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

    public function project()
    {
        return $this->belongsTo(Project::class, 'pid');
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
        $date = now();

        $user = User::getAuth();

        $deff = [
            'notes' => ['', 'notes'],
            'taxname' => [''],
            'tax2' => [0.0],
            'taxrate' => [0.0],
            'taxrate2' => [0.0],
            'paymentmethod' => [''],
            'status' => [self::STATUS[0]],
            'r' => ['0'],
            'aid' => [$user instanceof Client ? 0 : $user->id],
            'invoicenum' => [Config::get('invoice_code_prefix', 'INV-')],
            'date' => [$date],
            'duedate' => [$date],
            'nd' => [$date],
            'datepaid' => [$date],
            'discount_type' => ['f'],
            'discount_value' => [0.0],
            'discount' => [0.0],
            'tax' => [0.0],
            'cn' => [self::getNextNum()],
            'is_credit_invoice' => [0],
            'currency_iso_code' => [Currency::getDefault()->iso_code]
        ];

        if($user instanceof Client) {
            $this->setClient($user);
        }else{
            $deff['account'] = [''];
        }


        return $deff;
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
        $search = array_search($this->date->diff($this->duedate)->days, self::DUEDATE);

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

//        return $this->credit;
        return $this->total;
    }

    public function getDueAmount()
    {
        return round($this->credit ? $this->total - $this->credit : $this->total, 2);
    }

    public function paySetDate(array $data, Pay $pay): array
    {
        $currency = $this->getCurrencyIso ?? Currency::getDefault();
        $data['amount'] = round($this->getDueAmount() * 100, 2);
        $data['currency'] = $currency->iso_code;
        $data['description'] = $this->getCode();
        return $data;
    }

    public function paySuccess(Pay $pay, mixed $result = null): void
    {
        $this->status = self::STATUS[1];
        $this->paymentmethod = $pay->getMethod();
        $this->save();

        if($pay->getMethod() == 'stripe') {
            /**
             * @var \Stripe\Charge $result
             */

            Transaction::create(
                account: $pay->getMethod(),
                invoice: $this,
                amount: round($result->amount / 100, 2),
                description: $result->id,
                currency: $result->currency
            );
        }
    }

    public function transactionRemove(Transaction $transaction)
    {
        /** Тут возможно нужно делать перерасчет в валютах*/
        if($transaction->iid == $this->id) {
            $this->credit -= $transaction->amount;
            $this->save();
        }
    }

    public function getPublicUrl()
    {
        return frontLink("/public/invoice/view/{$this->vtoken}");
    }

    public function setClient(Client $client)
    {
        $this->userid = $client->id;
        $this->account = $client->account;
        $this->setCurrency($client->getCurrencyIso);
    }

    public static function createItem($price, Currency $currency, $description, $type = null)
    {
        DB::beginTransaction();
        $invoice = self::newDefault();

        $invoice->subtotal = $price;
        $invoice->total = $price;
        $invoice->currency_iso_code = $currency->iso_code;
        $invoice->save();

        $item = InvoiceItem::newDefault();
        $item->setDocument($invoice);
        $item->description = $description;
        $item->amount = $price;
        $item->total = $price;
        $item->currency_iso_code = $currency->iso_code;
        if($type) {
            $item->type = $type;
        }
        $item->save();
        DB::commit();

        return $invoice;
    }

    public function addAmount($amount)
    {
        $prePay = $this->total - $this->credit;
        if($prePay <= $amount) {
            $this->status = self::STATUS[1];
        }else{
            $this->status = self::STATUS[2];
        }

        $this->credit += $amount;
        return $this;
    }
}
