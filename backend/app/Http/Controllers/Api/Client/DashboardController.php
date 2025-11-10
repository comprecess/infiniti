<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\Client\Document\DocumentResource;
use App\Http\Resources\Resident\Invoices\InvoiceListResource;
use App\Http\Resources\Resident\Invoices\OfferListResource;
use App\Http\Resources\Resident\Orders\OrderListClientResource;
use App\Http\Resources\Resident\Transactions\TransactionsListResource;
use App\Models\BusinessModel\BusinessModel;
use App\Models\Catalog\User as Talent;
use App\Models\Config;
use App\Models\Resident\Invoices\Invoice;
use App\Models\User;


class DashboardController extends Controller
{

    public function index()
    {
        $user = User::getAuth();
        $quantity = [
            'project' => $user->projects()->count(),
            'businessModel' => BusinessModel::count(),
            'businessPlan' => $user->myBusinessPlans()->count(),
            'talent' => Talent::active()->count()
        ];

        $invoices = $user->invoices()->with(['getCurrencyIso', 'user', 'user.companyClient','user.group'])->orderByDesc('id')->limit(5)->get();
        $offers = $user->offers()->with(['getCurrencyIso', 'user', 'user.companyClient','user.group'])->orderByDesc('id')->limit(5)->get();
        $order = $user->orders()->with(['getCurrencyIso'])->orderByDesc('id')->limit(5)->get();
        $documents = $user->documents()->orderByDesc('id')->limit(5)->get();

        $hideExpense = Config::get('hide_expense_client');
        if($hideExpense) {
            $transactionQuery = $user->transactionPayer();
        }else{
            $transactionQuery = $user->transaction();
        }
        $transactions = $transactionQuery->orderByDesc('id')->limit(5)->get();

        $graph = [];
        $currency = $user->getCurrencyIso;
        $invoicesQuery = $user->invoices();
        foreach([
                    Invoice::STATUS[1] => [Invoice::STATUS[1]],
                    Invoice::STATUS[0] => [Invoice::STATUS[0], Invoice::STATUS[2]],
                ] as $name => $status) {

            $newQuery = $invoicesQuery->clone();
            $newQuery->whereIn('status', $status);

            $i = 12;
            $dateGraph = now();
            while ($i) {
                $start = $dateGraph->startOfMonth()->copy();
                $end = $dateGraph->endOfMonth()->copy();

                $graph[$start->format('m/d/Y')][$name] = $newQuery->clone()
                    ->where('date', '>=', $start)
                    ->where('date', '<=', $end)
                    ->get()
                    ->getSumTotal($currency);



                $dateGraph = $start->subMonths(1)->copy();
                $i--;
            }

        }

        return response()->json([
            'order' => OrderListClientResource::collection($order),
            'invoice' => InvoiceListResource::collection($invoices),
            'offer' => OfferListResource::collection($offers),
            'transaction' => TransactionsListResource::collection($transactions),
            'quantity' => $quantity,
            'graph' => $graph,
            '$document' => DocumentResource::collection($documents),
        ]);
    }

}
