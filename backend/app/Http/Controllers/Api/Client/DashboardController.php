<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\Resident\Invoices\InvoiceListResource;
use App\Http\Resources\Resident\Invoices\OfferListResource;
use App\Http\Resources\Resident\Orders\OrderListClientResource;
use App\Http\Resources\Resident\Transactions\TransactionsListResource;
use App\Models\Config;
use App\Models\User;


class DashboardController extends Controller
{

    public function index()
    {
        $user = User::getAuth();

        $invoices = $user->invoices()->with(['getCurrencyIso', 'user', 'user.companyClient','user.group'])->orderByDesc('id')->limit(10)->get();
        $offers = $user->offers()->with(['getCurrencyIso', 'user', 'user.companyClient','user.group'])->orderByDesc('id')->limit(10)->get();
        $order = $user->orders()->with(['getCurrencyIso'])->orderByDesc('id')->limit(10)->get();

        $hideExpense = Config::get('hide_expense_client');
        if($hideExpense) {
            $transactionQuery = $user->transactionPayer();
        }else{
            $transactionQuery = $user->transaction();
        }
        $transactions = $transactionQuery->orderByDesc('id')->limit(10)->get();

        return response()->json([
            'order' => OrderListClientResource::collection($order),
            'invoice' => InvoiceListResource::collection($invoices),
            'offer' => OfferListResource::collection($offers),
            'transaction' => TransactionsListResource::collection($transactions),
        ]);
    }

}
