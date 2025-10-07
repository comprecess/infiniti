<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\Client\Transactions\TransactionsListResource;
use App\Models\Config;
use App\Models\User;
use App\Http\Controllers\Api\Traits\CRUD;


class TransactionController extends Controller
{
    use CRUD;

    public function list()
    {
        $user = User::getAuth();

        if(Config::get('hide_expense_client')) {
            $transactions = $user->transactionPayer();
        }else{
            $transactions = $user->transaction();
        }

        $transactions->with(['getCurrencyIso']);


        return $this->index($transactions, TransactionsListResource::class, true);
    }
}
