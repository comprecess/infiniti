<?php

namespace App\Models\Resident\Transactions;

use App\Models\Collection\TransactionCollection;
use App\Models\Contracts\InsertDefaultValueInterface;
use App\Models\Resident\Client\Company;
use App\Models\Resident\Invoices\Invoice;
use App\Models\Resident\Settings\Currency;
use App\Models\Traits\CollectionTrait;
use App\Models\Traits\CurrencyTrait;
use App\Models\Traits\FileStorageTrait;
use App\Models\Traits\HelperTrait;
use App\Models\Traits\InsertDefaultValueTrait;
use App\Models\Traits\TagsTrait;
use App\Models\Traits\UserTrait;
use App\Models\Users\Admin;
use App\Models\Users\Client;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class Transaction extends Model implements InsertDefaultValueInterface
{
    use HasFactory, CurrencyTrait, CollectionTrait, UserTrait, InsertDefaultValueTrait, HelperTrait, FileStorageTrait, TagsTrait;

    /**
     * Income - поступление
     * Expense - отчесление
     * Out - перевод
     */

    const TYPE = ['Income', 'Expense', 'Out', 'In', 'Equity'];

    const INCOME_TYPE = ['Income', 'In', 'Equity'];

    const EXPENSE_TYPE = ['Expense', 'Out'];

    const TYPE_NON = 'Uncleared';

    const STATUS = ['Cleared','Uncleared','Reconciled','Void'];

    protected $table = "sys_transactions";

    protected $adminColumn = 'aid';

    protected $collection = TransactionCollection::class;

    protected $casts = [
        'date' => 'date',
    ];

    //Плательщик
    public function payerUser()
    {
        return $this->belongsTo(Client::class, 'payerid');
    }

    //получатель платежа
    public function payeeUser()
    {
        return $this->belongsTo(Client::class, 'payeeid');
    }

    public function invoice()
    {
        return $this->belongsTo(Invoice::class, 'iid');
    }

    public function account()
    {
        return $this->belongsTo(Account::class, 'account_id');
    }
    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public static function byAdmin(callable $callable = null)
    {
        $transactionQuery = self::checkAccess('all', 'bank_n_cash')
            ->where('type', '!=', self::TYPE_NON)
            ->with(['account', 'getCurrencyIso']);

        if(is_callable($callable)) {
            $callable($transactionQuery);
        }

        return $transactionQuery->get();
    }

    public function getDefault(): array
    {
        return [
            'date' => [now()],
            'account' => [''],
            'account_id' => [0],
            'project_id' => [0],
            'type' => ['In'],
            'amount' => [0],
            'payerid' => [0],
            'payeeid' => [0],
            'status' =>['Cleared'],
            'iid' => [0],
            'rid' => [0],
            'pid' => [0],
            'tax' => [0],
            'dr' => [0],
            'cr' => [0],
            'bal' => [0],
            'archived' => [0],
            'trash' => [0],
            'flag' => [0],
            'currency' => [0],
            'vid' => [rand(1,99999999)],
            'staff_id' => [0],
        ];
    }

    public static function create(
        #Платежный аккаунт
        Account|string|null $account = null,
        #Получить или вывод (Компания тут же)
        ?Client $payer = null,
        ?Client $payee = null,
        ?Client $client = null,
        #Счет (проджект)
        ?Invoice $invoice = null,
        #тип
        ?string $type = "Income",
        #Категория
        ?Category $category = null,
        #Сумма
        int|float|null $amount = null,
        #Метод
        ?string $method = null,
        #Описание
        ?string $description = null,
        $dr = null,
        $cr = null,
        $bal = null,
        Currency|string|null $currency = null,
        ?Admin $owner = null
    )
    {
        $transaction = self::newDefault();
        $clientOnly = $client ?? $payer ?? $payee;

        if($account instanceof Account) {
            $transaction->account_id = $account->id;
            $transaction->account = $account->account;
        } elseif (is_string($account)) {
            $transaction->account = $account;
        }

        #invoice
        if($invoice) {
            $currencyInvoice = $invoice->getCurrencyIso;
            $transaction->iid = $invoice->id;
            $transaction->project_id = $invoice->pid;
            $transaction->type = "Income";
            $transaction->tax = $invoice->tax;
            $transaction->currency_iso_code = $currencyInvoice?->iso_code;
            $transaction->currency_rate = $currencyInvoice?->rate;
            $transaction->aid = $invoice->aid;
            $transaction->code = $invoice->getCode();

            if(!$client) {
                $client = $invoice->user;
            }
        }

        $transaction->type = $transaction->type ?? $type;

        if($category) {
            $transaction->cat_id = $category->id;
            $transaction->category = $category->name;
        }

        $transaction->amount = $amount ?? $invoice?->total;

        $transaction->payerid = $payer ? $payer->id : 0;
        $transaction->payeeid = $payee ? $payee->id : 0;

        if(!($payee || $payer) && $client) {
            if(in_array($transaction->type, self::INCOME_TYPE)) {
                $transaction->payerid = $client->id;
            }else{
                $transaction->payeeid = $client->id;
            }
        }

        $transaction->method = $method;
        $transaction->description = $description;

        if($dr) {
            $transaction->dr = $dr;
            $transaction->amount = $dr;
        }

        if($cr) {
            $transaction->cr = $cr;
            $transaction->amount = $cr;
        }

        if(!($cr || $dr) && $transaction->amount) {
            if(in_array($transaction->type, self::INCOME_TYPE)) {
                $transaction->cr = $transaction->amount;
            }else{
                $transaction->dr = $transaction->amount;
            }
        }

        if($currency instanceof Currency) {
            $transaction->currency_iso_code = $currency->iso_code;
            $transaction->currency_rate = $currency->rate;
        }elseif(is_string($currency) && strlen((string) $currency) == 3) {
            $cur = Currency::getAndCreate($currency);
            if(!is_string($cur)) {
                $transaction->currency_iso_code = $cur->iso_code;
                $transaction->currency_rate = $cur->rate;
            } else {
                $transaction->currency_iso_code = $cur;
            }
        }

        $transaction->company_id = $clientOnly->companyClient?->id ?? 0;
        if($owner) {
            $transaction->aid = $owner->id;
        }

        try{
            $transaction->save();
        }catch (\Exception $e) {
            Log::error($e->getMessage(), $e->getTrace());
            throw new \Exception("Insufficient data to complete the transaction");
        }

        return $transaction;
    }

    public function setAccount(Account $account)
    {
        $this->account = $account->account;
        $this->account_id = $account->id;
    }

    public function setAmount(string $type, float|int $amount)
    {
        if(in_array($type, self::TYPE)) {
            $this->type = $type;
            $this->amount = $amount;
            if (in_array($type, self::INCOME_TYPE)) {
                $this->cr = $amount;
            } else {
                $this->dr = $amount;
            }
        }

    }

    public static function getQueryBalance()
    {
        return DB::table((new self())->getTable())
            ->selectRaw('`account_id`, `type`, `currency_iso_code`, SUM(amount) as amount')
            ->groupBy(['account_id', 'type', 'currency_iso_code'])
            ->orderBy('account_id', 'asc');
    }

    public static function getBalance(?Currency $currency = null, ?callable $callableQuery = null)
    {
        $newData = [];
        $currencyBuf = [];
        $query = self::getQueryBalance();
        if(is_callable($callableQuery)) {
            $callableQuery($query);
        }
        $data = $query->get();

        $data->each(function($item) use(&$newData, $currency, &$currencyBuf){
            if(!isset($currencyBuf[$item->currency_iso_code])) {
                $currencyBuf[$item->currency_iso_code] = Currency::getAndCreate($item->currency_iso_code, true);
            }

            $transaction = new self();
            $transaction->currency_iso_code = $item->currency_iso_code;
            $transaction->amount = $item->amount;
            $key = "{$item->account_id}.{$item->type}";
            $amount = Arr::get($newData, $key, 0);
            Arr::set($newData, $key, $transaction->transformPrice('amount', $currency) + $amount);
        });

        return $newData;
    }


}
