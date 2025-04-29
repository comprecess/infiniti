<?php


namespace App\Http\Controllers\Api\Resident\Transactions;


use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Requests\Resident\Transactions\BillCreateRequest;
use App\Http\Requests\Resident\Transactions\TransactionsCreateRequest;
use App\Http\Requests\Resident\Transactions\TransactionsTypeRequest;
use App\Http\Requests\Resident\Transactions\TransferRequest;
use App\Http\Resources\Resident\Client\ClientResource;
use App\Http\Resources\Resident\Client\CompanyResource;
use App\Http\Resources\Resident\Invoices\AccountInfoResource;
use App\Http\Resources\Resident\Invoices\CategoryInfoResource;
use App\Http\Resources\Resident\Invoices\PayMethodsResource;
use App\Http\Resources\Resident\Settings\CurrencyResource;
use App\Http\Resources\Resident\Transactions\BillsResource;
use App\Http\Resources\Resident\Transactions\TransactionsResource;
use App\Http\Resources\Resident\Settings\TagResource;
use App\Http\Resources\Users\AdminListResource;
use App\Models\Config;
use App\Models\Log;
use App\Models\Resident\Client\Company;
use App\Models\Resident\Settings\Currency;
use App\Models\Resident\Settings\Tag;
use App\Models\Resident\Transactions\Account;
use App\Models\Resident\Transactions\Bill;
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

    private function getType()
    {
        $request = app(TransactionsTypeRequest::class);
        return $request->getType();
    }


    public function inputData()
    {
        $type = $typeTag = $this->getType();
        $newTypeTag = ['Out' => 'Transfer'];

        $client = Client::with(['files', 'companyClient', 'group'])->get();
        $account = Account::all();
        $category = Category::income()->orderBy('sorder', 'asc')->get();
        $paymethods = PayMethods::orderBy('sorder', 'asc')->get();

        if(isset($newTypeTag[$typeTag])) {
            $typeTag = $newTypeTag[$typeTag];
        }

        $tags = Tag::where('type', $typeTag)->get();
        $staff = Admin::all();
        $currency = Currency::all();
        $company = Company::all();
        $transaction = Transaction::where('type', $type)
            ->with(['company'])
            ->checkAccess(...['all', 'transactions'])
            ->orderByDesc('id')
            ->limit(20)
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
        $type = $this->getType();

        if(!$transaction?->id) {
            $transaction = Transaction::newDefault();
        }

        return $this->createOrUpdateCRUD($request, $transaction, function($model, $request) use ($type){
            $amount = $request->getAmount();
            $currency = $request->getModel('currency');
            if($request->tags) {
                Tag::setTag(data: $request->tags, type: $type);
                $model->tags = implode(',',$request->tags);
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

            $model->type = $type;
            if($type == Transaction::TYPE[0]) {
                $model->cr = $amount;
            }else{
                $model->dr = $amount;
            }
            $model->category = $request->getModel('category')?->name ?? null;
            $model->aid = User::getAuth()->id;
            $model->currency_iso_code = $currency->iso_code;
            $model->currency = $currency->id;
            $model->currency_rate = $currency->rate;
        }, function($model, $request, $isNew) use($type){
            if($request->file) {
                if(!$isNew) {
                    $model->deleteAllFiles();
                }
                $model->uploads($request->file);
            }
            Log::send('New '.$type.': ' .
                $request->description .
                ' [TrID: ' .
                $model->id .
                ' | Amount: ' .
                $request->getAmount() .
                ']');
        });
    }

    public function transfer(TransferRequest $request)
    {
        $from = Transaction::newDefault();
        $to = Transaction::newDefault();
        return $this->createOrUpdateCRUD($request, $from, function($model, $request) use($to){
            if($request->tags) {
                $tagsString = implode(',',$request->tags);
                Tag::setTag(data: $request->tags, type: 'Transfer');
                $model->tags = $tagsString;
                $to->tags = $tagsString;
            }
            $faccount = $request->getModel('fromAccount');
            $taccount = $request->getModel('toAccount');
            $amount = $request->getAmount();
            $method = $request->getModel('payMethods');
            $currency = $request->getModel('currency');
            $user = User::getAuth();

            $model->account = $faccount->account;
            $model->account_id = $faccount->id;
            $model->type = Transaction::TYPE[2];
            $model->amount = $amount;
            $model->dr = $amount;
            $model->aid = $user->id;
            $model->currency_rate = $currency->rate;

            $to->account = $taccount->account;
            $to->account_id = $taccount->id;
            $to->type = Transaction::TYPE[3];
            $to->amount = $amount;
            $to->method = $method;
            $to->ref = $request->referralLink;
            $to->description = $request->description;
            $to->date = $request->date;
            $to->cr = $amount;
            $to->aid = $user->id;
            $to->currency_iso_code = $currency->iso_code;
            $to->currency = $currency->id;
            $to->currency_rate = $currency->rate;
            $to->save();
        });
    }

    public function bill()
    {
        $days = 30;
        $today = now();

        $bills_upcoming = Bill::whereBetween('next_date', [$today, (clone $today)->addDays($days)])
            ->with(['account', 'getCurrencyIso', 'client', 'category'])
            ->orderBy('next_date', 'asc')
            ->get();

        $bills_past_due = Bill::whereBetween('next_date', [
            $today,
            (clone $today)->subDays($days),
        ])
            ->with(['account', 'getCurrencyIso', 'client', 'category'])
            ->orderBy('next_date', 'asc')
            ->where('is_paid', 0)
            ->get();

        return response()->json(['billsUpcoming' => BillsResource::collection($bills_upcoming), 'billsPastDue' => BillsResource::collection($bills_past_due)]);
    }

    public function billAll()
    {
        $bills = Bill::orderBy('next_date', 'asc');
        return $this->index($bills, BillsResource::class);
    }

    public function billCreateOrUpdate(BillCreateRequest $request, Bill $model)
    {
        return $this->createOrUpdateCRUD($request, $model);
    }

}
