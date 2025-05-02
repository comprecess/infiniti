<?php


namespace App\Http\Controllers\Api\Resident\Transactions;


use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Requests\Resident\Transactions\AccountCreateRequest;
use App\Http\Resources\Resident\Settings\CurrencyResource;
use App\Http\Resources\Resident\Transactions\AccountListResource;
use App\Http\Resources\Users\AdminListResource;
use App\Models\Resident\Settings\Currency;
use App\Models\Resident\Transactions\Account;
use App\Models\Resident\Transactions\Transaction;
use App\Models\User;
use App\Models\Users\Admin;


class AccountController extends TransactionsAccessController
{
    use CRUD {
        createOrUpdate as createOrUpdateCRUD;
    }

    public function list()
    {
        $transactionPrint = new Transaction();
        $currency = Currency::getDefault();
        $balances = Account::getBalance($currency);
        $transactionPrint->setCurrency($currency);

        $balanceAll = $balanceTotal = [];
        foreach(Transaction::TYPE as $type){
            $balanceAll[$type] = $balances->pluck("balance.{$type}")->sum();
        }

        $balanceTotal[Transaction::TYPE[0]] = $balanceAll[Transaction::TYPE[0]] + $balanceAll[Transaction::TYPE[3]];
        $balanceTotal[Transaction::TYPE[1]] = $balanceAll[Transaction::TYPE[1]] + $balanceAll[Transaction::TYPE[2]];
        $balanceTotal[Transaction::TYPE[4]] = $balanceAll[Transaction::TYPE[4]];
        $balanceTotal['Total'] = $balanceTotal[Transaction::TYPE[0]] - $balanceTotal[Transaction::TYPE[1]];

        foreach($balanceTotal as $key => $val) {
            $transactionPrint->amount = $val;
            $balanceTotal[$key] = $transactionPrint->printPrice('amount', $currency);
        }

        return response()->json(
            [
                'list' => AccountListResource::collection($balances),
                'balance' => $balanceTotal
            ]);

    }

    public function inputData()
    {
        $currency = Currency::all();
        $staffQuery = Admin::query();

        $user = User::getAuth();
        if(!$user->checkAccess()){
            $staffQuery->where('id', $user->id);
        }
        $staff = $staffQuery->get();

        return response()->json([
            'currency' => CurrencyResource::collection($currency),
            'owner' => AdminListResource::collection($staff),
        ]);
    }

    public function create(AccountCreateRequest $request)
    {
        return $this->createOrUpdateCRUD($request, new Account(), null, function($model, $request){
            if($request->balance) {
                foreach($request->balance as $value){
                    $amount = $value['amount'];
                    if(!$amount) {
                        continue;
                    }
                    $currency = Currency::find($value['currency']);

                    $transaction = Transaction::newDefault();
                    $transaction->setAccount($model);
                    $transaction->setCurrency($currency);
                    $transaction->setAmount(Transaction::TYPE[4], $amount);
                    $transaction->description = 'Opening balance';
                    $transaction->date = now();
                    $transaction->aid = User::getAuth()->id;
                    $transaction->source = 'Opening balance';
                    $transaction->save();
                }
            }

        });
    }



}
