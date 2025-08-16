<?php


namespace App\Http\Controllers\Api\Resident\Transactions;


use App\Http\Controllers\Api\Resident\ResidentController;
use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Requests\Resident\Transactions\AccountEquityRequest;
use App\Http\Requests\Resident\Transactions\AccountListRequest;
use App\Http\Requests\Resident\Transactions\AccountRequest;
use App\Http\Resources\Resident\Settings\CurrencyResource;
use App\Http\Resources\Resident\Transactions\AccountListResource;
use App\Http\Resources\Resident\Transactions\AccountResource;
use App\Http\Resources\Users\AdminListResource;
use App\Models\Resident\Settings\Currency;
use App\Models\Resident\Transactions\Account;
use App\Models\Resident\Transactions\Transaction;
use App\Models\User;
use App\Models\Users\Admin;


class AccountController extends ResidentController
{
    use CRUD {
        createOrUpdate as createOrUpdateCRUD;
        delete as deleteCRUD;
    }

    public function list(AccountListRequest $request)
    {
        $transactionPrint = new Transaction();
        $currency = Currency::getDefault();
        $transactionPrint->setCurrency($currency);

        $accountQuery = Account::query()
        /*    ->joinSub(Transaction::getQueryBalance(), 'transaction', function($join){
                $join->on('sys_accounts.id', '=','transaction.account_id');
            })*/;
        /*if($search = Arr::get($request->all(), 'filter.search')){
            $search = "%{$search}%";
            $accountQuery->where(function($query) use($search){
                $query->where('id','like', $search)
                    ->orWhere('sys_accounts.account', 'like', $search)
                    ->orWhere('sys_accounts.description', 'like', $search)
                    ->orWhere('sys_accounts.account_number', 'like', $search)
                    ->orWhere('sys_accounts.contact_person', 'like', $search)
                    ->orWhere('sys_accounts.contact_phone', 'like', $search)
                    ->orWhere('sys_accounts.ib_url', 'like', $search);
                });
        }*/
        $request->sortModel($accountQuery)->searchModel($accountQuery);
        $accountQuery = $accountQuery->paginate($request->input('amount') ?? 6);

        $balances = Account::getBalance($currency, $accountQuery);

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

//        return  AccountListResource::collection($balances);

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

    public function createOrUpdate(AccountRequest $request, Account $account)
    {
        return $this->createOrUpdateCRUD($request, $account, function($model, $request, $isNew){
            $model->sorder = 1;
        }, function($model, $request, $isNew){
            if($isNew){
                $this->createEquity($model, $request->balance);
                /*
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
                */
            }else{
                Transaction::where('account_id', $model->id)->update(['account' => $model->account]);
            }

        });
    }

    private function createEquity(Account $model, $balance)
    {
        if($balance) {
            foreach($balance as $value){
                $amount = $value['amount'];
                if(!$amount) {
                    continue;
                }
                $currency = Currency::find($value['currency']);

                $transaction = Transaction::newDefault();
                $transaction->setAccount($model);
                $transaction->setCurrency($currency);
                $transaction->setAmount(Transaction::TYPE[4], $amount);
                $transaction->description = $transaction->source = 'Opening balance';
                $transaction->aid = User::getAuth()->id;
                $transaction->save();
            }
        }
    }

    public function item(Account $account)
    {
        $account->load(['transactions']);
        return new AccountResource($account);
    }

    public function delete(Account $account)
    {
        return $this->deleteCRUD($account);
    }

    public function equity(AccountEquityRequest $request, Account $account)
    {
        $this->createEquity($account, $request->balance);
        return $this->defResponse();
    }


}
