<?php


namespace App\Http\Controllers\Api\Resident\Transactions;


use App\Events\Resident\Transactions\Delete;
use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Requests\Resident\Transactions\BillCreateRequest;
use App\Http\Requests\Resident\Transactions\BillListRequest;
use App\Http\Requests\Resident\Transactions\TransactionsCreateRequest;
use App\Http\Requests\Resident\Transactions\TransactionsListRequest;
use App\Http\Requests\Resident\Transactions\TransactionsTypeRequest;
use App\Http\Requests\Resident\Transactions\TransactionsUpdateRequest;
use App\Http\Requests\Resident\Transactions\TransferRequest;
use App\Http\Resources\Resident\Client\ClientResource;
use App\Http\Resources\Resident\Client\CompanyResource;
use App\Http\Resources\Resident\Invoices\AccountInfoResource;
use App\Http\Resources\Resident\Invoices\CategoryInfoResource;
use App\Http\Resources\Resident\Invoices\PayMethodsResource;
use App\Http\Resources\Resident\Settings\CurrencyResource;
use App\Http\Resources\Resident\Transactions\BillsResource;
use App\Http\Resources\Resident\Transactions\TransactionsItemResource;
use App\Http\Resources\Resident\Transactions\TransactionsListResource;
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
use App\Services\Document\DocumentVariables;
use Illuminate\Support\Arr;
use Illuminate\Http\Request;

class TransactionsController extends TransactionsAccessController
{
    use CRUD {
        createOrUpdate as createOrUpdateCRUD;
    }

    const ACCESS = ['all', 'transactions'];

    private function getType()
    {
        $request = app(TransactionsTypeRequest::class);
        return $request->getType();
    }

    public function getDocumentVariables(): DocumentVariables
    {
        $columns = [
            'code' => 'Code',
            'date' => 'Date',
            'account' => 'Account',
            'type' => 'Type',
            'amount' => 'Amount',
            'description' => 'Description'
        ];

        $varibles = new DocumentVariables();

        $varibles->nameDocument = "Transactions";
        $varibles->header = "Transactions - Infiniti";

        $varibles->columns = $columns;
        $varibles->excelView = 'document.excel.resident-transactions';
        $varibles->resource = TransactionsListResource::class;


        return $varibles;
    }


    public function inputData()
    {
        $type = $typeTag = $this->getType();
        $newTypeTag = ['Out' => 'Transfer'];

        $client = Client::with(['files', 'companyClient', 'group'])->get();
        $account = Account::all();
        $category = Category::orderBy('sorder', 'asc');
        if(!in_array($type, ['Out'])) {
            $category->where('type', $type);
        }
        $category = $category->get();
        $paymethods = PayMethods::orderBy('sorder', 'asc')->get();

        if(isset($newTypeTag[$typeTag])) {
            $typeTag = $newTypeTag[$typeTag];
        }

        $code_prefix = 'INC-';
        if($type == Transaction::TYPE[0]) {
            $code_prefix = Config::get('invoice_code_prefix');
        }elseif($type == Transaction::TYPE[1]){
            $code_prefix = Config::get('expense_code_prefix');
        }

        $tags = Tag::where('type', $typeTag)->get();
        $staff = Admin::all();
        $currency = Currency::all();
        $company = Company::all();
        $transaction = Transaction::where('type', $type)
            ->with(['company'])
            ->checkAccess(...self::ACCESS)
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
            'code' => $code_prefix . Transaction::getNextNum(),
            'status' => [Transaction::STATUS[0], Transaction::STATUS[1]],
            'company' => CompanyResource::collection($company),
            'transactionTypes' => TransactionsListRequest::TYPE,
            'recurringType' => Bill::RECURRING_TYPE
        ]);
    }

    public function item(Transaction $transaction)
    {
        return new TransactionsItemResource($transaction);
    }

    public function publicVid(Request $request)
    {
        $id = $request->route('id');

        $transaction = Transaction::where('vid', $id)->orderBy('id', 'desc')->firstOrFail();
        return new TransactionsItemResource($transaction);
    }

    public function create()
    {
        return $this->createOrUpdate(new Transaction());
    }

    public function createOrUpdate(Transaction $transaction)
    {
        $type = $this->getType();

        if(!$transaction?->id) {
            $transaction = Transaction::newDefault();
            $request = app(TransactionsCreateRequest::class);
        } else {
            $request = app(TransactionsUpdateRequest::class);
        }

        return $this->createOrUpdateCRUD($request, $transaction, function($model, $request, $isNew) use ($type){
            if(!$isNew) {
                $type = $model->type;
            }
            $amount = $request->getAmount();
            if($request->tags) {
                Tag::setTag(data: $request->tags, type: $type);
                $model->tags = implode(',',$request->tags);
            }

            $category = $request->getModel('category');
            if($category) {
                $category->total_amount += $amount;
                $category->save();
            }

            $model->category = $request->getModel('category')?->name ?? null;
            $model->aid = User::getAuth()->id;
            if($isNew){
                $currency = $request->getModel('currency');
                $model->currency_iso_code = $currency->iso_code;
                $model->currency = $currency->id;
                $model->currency_rate = $currency->rate;

                $model->type = $type;
                if($type == Transaction::TYPE[0]) {
                    $model->cr = $amount;
                }else{
                    $model->dr = $amount;
                }

                $account = $request->getModel('account');
                if($account) {
                    $model->account = $account->account;
                    $model->account_id = $account->id;
                }
            }
        }, function($model, $request, $isNew) use($type){
            if($request->file) {
                if(!$isNew) {
                    $model->deleteAllFiles();
                }
                $model->uploads($request->file);
            }
            $edit = $isNew ? 'New' : 'Edit';
            Log::send($edit.' '.$type.': ' .
                $request->description .
                ' [TrID: ' .
                $model->id .
                ' | Amount: ' .
                $request->getAmount() .
                ']');
        });
    }

    public function delete(Transaction $transaction)
    {
        $transaction->delete();
        event(new Delete($transaction));
        return $this->defResponse();
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

    public function bill(BillListRequest $request)
    {
        $days = 30;
        $today = now();

        $billsUpcomingQuery = Bill::whereBetween('next_date', [$today, (clone $today)->addDays($days)])
            ->with(['account', 'getCurrencyIso', 'client', 'category'])
            ->orderBy('next_date', 'asc');

        $billsPastDueQuery = Bill::whereBetween('next_date', [
            (clone $today)->subDays($days),
            $today,
        ])
            ->with(['account', 'getCurrencyIso', 'client', 'category'])
            ->orderBy('next_date', 'asc')
            ->where('is_paid', 0);

        if($search = Arr::get($request->all(), 'filter.search')){
            $billsUpcomingQuery->where(function($query) use($search){
                $query->where('id', 'like', "%{$search}%")
                    ->orWhere('title', 'like', "%{$search}%")
                    ->orWhere('website', 'like', "%{$search}%")
                ;
            });

            $billsPastDueQuery->where(function($query) use($search){
                $query->where('id', 'like', "%{$search}%")
                    ->orWhere('title', 'like', "%{$search}%")
                    ->orWhere('website', 'like', "%{$search}%")
                ;
            });
        }

        $with = ['getCurrencyIso', 'account', 'client','category'];
        $billsUpcomingQuery->with($with);
        $billsPastDueQuery->with($with);


        $bills_upcoming = $billsUpcomingQuery->get();
        $bills_past_due = $billsPastDueQuery->get();

        return response()->json(['billsUpcoming' => BillsResource::collection($bills_upcoming), 'billsPastDue' => BillsResource::collection($bills_past_due)]);
    }

    public function billAll(BillListRequest $request)
    {
        $bills = Bill::query();

        if($search = Arr::get($request->all(), 'filter.search')){
            $bills->where(function($query) use($search){
                $query->where('id', 'like', "%{$search}%")
                    ->orWhere('title', 'like', "%{$search}%")
                    ->orWhere('website', 'like', "%{$search}%")
                ;
            });
        }
        $bills->with(['getCurrencyIso', 'account', 'client','category']);
        $request->sortModel($bills);

        return $this->index($bills, BillsResource::class);
    }

    public function billItem(Bill $bill)
    {
        return new BillsResource($bill);
    }

    public function billCreateOrUpdate(BillCreateRequest $request, Bill $bill)
    {
        return $this->createOrUpdateCRUD($request, $bill);
    }

    public function billDelete(Bill $bill)
    {
        return $this->delete($bill);
    }

    public function billPaid(Bill $bill)
    {
        $bill->is_paid = 1;
        $bill->save();
        return $this->defResponse();
    }

    public function list(TransactionsListRequest $request)
    {
        $transactionQuery = Transaction::checkAccess(...self::ACCESS);
        $request->filter($transactionQuery);
        /*$data = $request->all();

        if($type = Arr::get($data, 'filter.type')) {
            if($type == TransactionsListRequest::TYPE[2]) {
                $transactionQuery->whereIn('type', [Transaction::TYPE[2], Transaction::TYPE[3]]);
            }else{
                $transactionQuery->where('type', $type);
            }
        }

        if($status = Arr::get($data, 'filter.status')) {
            $transactionQuery->where('status', $status);
        }

        if($search = Arr::get($data, 'filter.search')) {
            $search = "%{$search}%";
            $transactionQuery->where(function($query) use($search){
                $query->where('id', 'like', $search)
                    ->orWhere('code', 'like', $search)
                    ->orWhere('account', 'like', $search)
                    ->orWhere('type', 'like', $search)
                    ->orWhere('amount', 'like', $search)
                    ->orWhere('description', 'like', $search);
            });
        }

        if($account = $request->getModel('filter.account')) {
            $transactionQuery->where('account_id', $account->id);
        }

        if($category = $request->getModel('filter.category')) {
            $transactionQuery->where('cat_id', $category->id);
        }

        if($client = $request->getModel('filter.client')) {
            $transactionQuery->where(function($query) use($client){
                $query->where('payerid', $client->id)->orWhere('payeeid', $client->id);
            });
        }

        if($date = $request->getDate()) {
            $transactionQuery->whereBetween('date', $date);
        }

        $transactionQuery->with(['getCurrencyIso']);

        $request->sortModel($transactionQuery);*/

        return $this->index($transactionQuery, TransactionsListResource::class, true);
    }

}
