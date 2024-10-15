<?php

namespace App\Models\Resident\Transactions;

use App\Models\Collection\TransactionCollection;
use App\Models\Resident\Invoices\Invoice;
use App\Models\Traits\CollectionTrait;
use App\Models\Traits\CurrencyTrait;
use App\Models\Traits\UserTrait;
use App\Models\Users\Client;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory, CurrencyTrait, CollectionTrait, UserTrait;

    const TYPE = ['Income', 'Expense', 'Out', 'In', 'Equity'];

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
}
