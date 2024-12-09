<?php

namespace App\Models\Resident\Transactions;

use App\Models\Collection\TransactionCollection;
use App\Models\Contracts\InsertDefaultValueInterface;
use App\Models\Resident\Client\Company;
use App\Models\Resident\Invoices\Invoice;
use App\Models\Resident\Settings\Currency;
use App\Models\Traits\CollectionTrait;
use App\Models\Traits\CurrencyTrait;
use App\Models\Traits\InsertDefaultValueTrait;
use App\Models\Traits\UserTrait;
use App\Models\Users\Admin;
use App\Models\Users\Client;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class Transaction extends Model implements InsertDefaultValueInterface
{
    use HasFactory, CurrencyTrait, CollectionTrait, UserTrait, InsertDefaultValueTrait;

    const TYPE = ['Income', 'Expense', 'Out', 'In', 'Equity'];

    const INCOME_TYPE = ['Income', 'In', 'Equity'];

    const EXPENSE_TYPE = ['Expense', 'Out'];

    const TYPE_NON = 'Uncleared';

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
}
