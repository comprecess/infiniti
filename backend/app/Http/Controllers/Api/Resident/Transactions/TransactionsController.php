<?php


namespace App\Http\Controllers\Api\Resident\Transactions;


use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Requests\Resident\Transactions\TransactionsCreateRequest;
use App\Http\Resources\Resident\Client\ClientResource;
use App\Http\Resources\Resident\Client\CompanyResource;
use App\Http\Resources\Resident\Invoices\AccountInfoResource;
use App\Http\Resources\Resident\Invoices\CategoryInfoResource;
use App\Http\Resources\Resident\Invoices\PayMethodsResource;
use App\Http\Resources\Resident\Settings\CurrencyResource;
use App\Http\Resources\Resident\Transactions\TransactionsResource;
use App\Http\Resources\Resident\Settings\TagResource;
use App\Http\Resources\Users\AdminListResource;
use App\Models\Config;
use App\Models\Log;
use App\Models\Resident\Client\Company;
use App\Models\Resident\Settings\Currency;
use App\Models\Resident\Settings\Tag;
use App\Models\Resident\Transactions\Account;
use App\Models\Resident\Transactions\Category;
use App\Models\Resident\Transactions\PayMethods;
use App\Models\Resident\Transactions\Transaction;
use App\Models\User;
use App\Models\Users\Admin;
use App\Models\Users\Client;

class TransactionsController extends TransactionsAccessController
{
    use CRUD {
        createOrUpdate as createOrUpdateCRUD;
    }

    public function inputData()
    {
        $client = Client::with(['files', 'companyClient', 'group'])->get();
        $account = Account::all();
        $category = Category::income()->orderBy('sorder', 'asc')->get();
        $paymethods = PayMethods::orderBy('sorder', 'asc')->get();
        $tags = Tag::where('type', Tag::TYPE[2])->get();
        $staff = Admin::all();
        $currency = Currency::all();
        $company = Company::all();
        $transaction = Transaction::where('type', Transaction::INCOME_TYPE[0])
            ->with(['company'])
            ->checkAccess(...['all', 'transactions'])
            ->orderByDesc('id')
            ->get();

        return response()->json([
            'client' => ClientResource::collection($client),
            'account' => AccountInfoResource::collection($account),
            'category' => CategoryInfoResource::collection($category),
            'payMethods' => PayMethodsResource::collection($paymethods),
            'tags' => TagResource::collection($tags),
            'transaction' => TransactionsResource::collection($transaction),
            'staff' => AdminListResource::collection($staff),
            'currency' => CurrencyResource::collection($currency),
            'code' => Config::get('invoice_code_prefix') . Transaction::getNextNum(),
            'status' => [Transaction::STATUS[0], Transaction::STATUS[1]],
            'company' => CompanyResource::collection($company),
        ]);
    }

    public function createOrUpdate(Transaction $transaction, TransactionsCreateRequest $request)
    {
        if(!$transaction?->id) {
            $transaction = Transaction::newDefault();
        }

        return $this->createOrUpdateCRUD($request, $transaction, function($model, $request){
            $amount = $request->getAmount();
            if($request->tags) {
                $model->tags = implode(',', $request->tags);
                foreach($request->tags as $tag) {
                    $tag = Tag::where('type', Tag::TYPE[2])->where('text', $tag)->first();
                    if(!$tag) {
                        $tag = new Tag();
                        $tag->type = Tag::TYPE[2];
                        $tag->text = $tag;
                        $tag->save();
                    }
                }
            }

            $category = $request->getModel('category');
            if($category) {
                $category->total_amount += $amount;
                $category->save();
            }

            $account = $request->getModel('account');
            if($account) {
                $model->account = $account->account;
                $model->account_id = $account->id;
            }

            $model->type = Transaction::INCOME_TYPE[0];
            $model->cr = $amount;
            $model->category = $request->getModel('category')?->name ?? null;
            $model->aid = User::getAuth()->id;
        }, function($model, $request){
            Log::send('New Deposit: ' .
                $request->description .
                ' [TrID: ' .
                $model->id .
                ' | Amount: ' .
                $request->getAmount() .
                ']');
        });
    }

}
