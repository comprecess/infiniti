<?php


namespace App\Http\Controllers\Api\Resident;


use App\Models\Resident\Client\Company;
use App\Models\Resident\Invoices\Invoice;
use App\Models\Resident\Leads\Leads;
use App\Models\Resident\Settings\Currency;
use App\Models\Resident\Settings\RoleAccess;
use App\Models\Resident\Transactions\Transaction;
use App\Models\Users\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;

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
        $id = auth()->id();
        $cashFlow = Cache::remember('dash_' . $id, config('cache.time.1hour'), function(){
            $cashFlow = [];

            $cashFlow['client'] = Client::hasType()->checkAccess(...self::ACCESS)->count();
            $cashFlow['company'] = Company::checkAccess(...self::ACCESS)->count();
            $cashFlow['leads'] = Leads::checkAccess(...self::ACCESS)->count();
            $transactions = Transaction::byAdmin();
            $cashFlow['newWorth'] = (new Transaction)->printPrice($transactions->getNetWorth());

            $transaction = Transaction::checkAccess(...self::ACCESS);
            $firstDayMount = Carbon::create(null,null,1);
            $date = now();
            $types = Transaction::TYPE;
            $currency = Currency::getDefault();
            $transactionPrice = new Transaction();
            foreach(['profit' => $types[0], 'expense' =>$types[1]] as $method => $type) {
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

            return $cashFlow;
        });


        return response()->json(['cashFlow' => $cashFlow]);
    }

}
