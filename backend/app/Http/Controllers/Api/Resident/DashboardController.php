<?php


namespace App\Http\Controllers\Api\Resident;


use App\Http\Resources\Resident\Client\ClientResource;
use App\Http\Resources\Resident\Invoices\AccountInfoResource;
use App\Http\Resources\Resident\Invoices\CategoryInfoResource;
use App\Http\Resources\Resident\Invoices\InvoiceListResource;
use App\Http\Resources\Resident\Invoices\TransactionResource;
use App\Http\Resources\Resident\Project\ProjectInfoResource;
use App\Models\Config;
use App\Models\Resident\Client\Company;
use App\Models\Resident\Invoices\Invoice;
use App\Models\Resident\Leads\Leads;
use App\Models\Resident\Project;
use App\Models\Resident\Settings\Currency;
use App\Models\Resident\Settings\RoleAccess;
use App\Models\Resident\Transactions\Account;
use App\Models\Resident\Transactions\Category;
use App\Models\Resident\Transactions\Transaction;
use App\Models\Users\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class DashboardController extends ResidentController
{
    const ACCESS = ['all', 'transactions'];

    public function roleAccess(Request $request)
    {
        if(in_array($request->route()->getActionMethod(), ['index'])) {
            return true;
        }
    }

    public function index()
    {
        $table = [
            'recentClients' => ['model' => Client::class, 'resource' => ClientResource::class, 'with' => ['files', 'companyClient', 'group']],
            'recentProjects' => ['model' => Project::class, 'resource' => ProjectInfoResource::class],
            'invoices' => ['model' => Invoice::class, 'resource' => InvoiceListResource::class, 'with' => ['user', 'user.files', 'user.companyClient', 'user.group']],
        ];

//        $id = auth()->id();
//        $cashFlow = Cache::remember('dash_' . $id, config('cache.time.1hour'), function(){
            $cashFlow = [];

            $cashFlow['client'] = Client::hasType()->checkAccess('all', 'customers')->count();
            $cashFlow['company'] = Company::checkAccess('all', 'companies')->count();
            $cashFlow['leads'] = Leads::checkAccess('all', 'leads')->count();
            $transactions = Transaction::byAdmin();
            $cashFlow['newWorth'] = (new Transaction)->printPrice($transactions->getNetWorth());

            $transaction = Transaction::checkAccess(...self::ACCESS)
                ->with(['getCurrencyIso']);
            $firstDayMount = Carbon::create(null,null,1);
            $date = now()->format('Y-m-d');
            $types = Transaction::TYPE;
            $currency = Currency::getDefault();
            $transactionPrice = new Transaction();
            foreach(['profit' => $types[0], 'expense' => $types[1]] as $method => $type) {
                $newTrans = $transaction->clone();
                $newTrans->where('type', $type);

                $cashFlow[$type]['today'] = $transactionPrice->printPrice($newTrans
                    ->clone()
                    ->where('date', $date)
                    ->get()
                    ->amount(), $currency);

                $cashFlow[$type]['thisMonth'] = $transactionPrice->printPrice($newTrans
                    ->clone()
                    ->where('date', '>=', $firstDayMount)
                    ->where('date', '<=', $date)
                    ->get()
                    ->{$method}(), $currency);

                $i = 12;
                $dateGraph = now();
                while ($i) {
                    $start = $dateGraph->startOfMonth()->copy();
                    $end = $dateGraph->endOfMonth()->copy();
                    $cashFlow['graph'][$start->format('Y M')][$type] =$newTrans
                        ->clone()
                        ->where('date', '>=', $start)
                        ->where('date', '<=', $end)
                        ->get()
                        ->{$method}();

                    $dateGraph = $start->subMonths(1)->copy();
                    $i--;
                }

                $cashFlow[$type]['total'] = $transactionPrice->printPrice($newTrans
                    ->get()
                    ->amount(), $currency);

            }

//            return $cashFlow;
//        });

        $data = [
            'cashFlow' => $cashFlow,
        ];

//        $dataCache = Cache::remember('dash_all_' . $id, config('cache.time.1hour'), function() use($table) {
            $dataCache = [];
            /*
            $currentMonth = Carbon::now();
            $currentMonth->setDay(1);
            $query = Transaction::where('date', '>=', $currentMonth->format('Y-m-d'))
                ->checkAccess('all', 'transactions')
                ->get();
            $income = $query->filter(function($item){
                return $item->type == Transaction::TYPE[0];
            });

            $expense = $query->filter(function($item){
                return $item->type == Transaction::TYPE[1];
            });

            $dataCache['incomeVsExpense'] = ['income' => $income->profit(), 'expense' => $expense->expense()];
            */
            /*
                    $cats = Category::where('type', Category::TYPE[0])
                        ->orderBy('total_amount', 'desc')
                        ->limit(10)
                        ->get();

                    $dataCache['expenseCats'] = CategoryInfoResource::collection($cats);
            */
            $accounts = Account::checkAccess('all', 'bank_n_cash')->get();
            $accountBalances = Transaction::checkAccess('all', 'bank_n_cash')->get();

            $dataCache['account'] = [
                'list' => AccountInfoResource::collection($accounts),
                'netWorth' => round($accountBalances->getNetWorth()),
                'limit' => Config::get('networth_goal', 35000),
            ];


            foreach (['latestExpense' => Transaction::TYPE[1], 'latestIncome' => Transaction::TYPE[0]] as $name => $type) {
                $query = Transaction::checkAccess('all', 'transactions')
                    ->where('type', $type)
                    ->limit(5)
                    ->orderBy('id', 'desc')
                    ->get();

                $dataCache[$name] = TransactionResource::collection($query);
            }


            #invoiceStatus
            $status = ['Paid', 'Unpaid', 'Partially Paid'];
            $dataPrecent = [];
            foreach ($status as $stat) {
                $dataPrecent[$stat] = Invoice::checkAccess('all', 'transactions')->where('status', $stat)->count();
            }
            $dataCache['invoiceStatus'] = array_percentage($dataPrecent);


            foreach ($table as $key => $value) {
                $resource = $value['resource'];
                $model = $value['model'];
                $query = $model::orderBy('id', 'desc')->limit(5);
                if(isset($value['with'])) {
                    $query->with($value['with']);
                }
                $dataCache[$key] = $resource::collection($query->get());
            }

//            return $dataCache;
//        });

        $data = array_merge($data, $dataCache);


        return response()->json($data);
    }

}
