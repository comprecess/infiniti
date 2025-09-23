<?php

namespace App\Console\Commands\Transaction;

use App\Models\Catalog\Cart;
use App\Models\Resident\Settings\Currency;
use App\Models\Resident\Transactions\Account;
use Illuminate\Console\Command;

class AccountBalance extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:account-balance';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Calculate account balance';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $currency = Currency::getDefault();

        Account::all()->each(function($account) use($currency){
            $summ = 0;
            $account->transactions()
                ->with(['getCurrencyIso','currencyHistory'])
                ->chunk(100, function($transactions)use(&$summ, $currency){
                    foreach($transactions as $transaction){
                        if($transaction->isIncome()) {
                            $summ += $transaction->transformPrice('amount', $currency);
                        }else{
                            $summ -= $transaction->transformPrice('amount', $currency);
                        }
                    }
                });
            $account->balance = $summ;
            $account->save();
        });
    }
}
