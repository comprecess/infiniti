<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\Resident\Invoices\InvoiceListResource;
use App\Http\Resources\Resident\Invoices\OfferListResource;
use App\Http\Resources\Resident\Transactions\TransactionsListResource;
use App\Models\User;


class DashboardController extends Controller
{

    public function index()
    {
        $user = User::getAuth();

        $invoices = $user->invoices()->orderByDesc('id')->limit(10)->get();
        $offers = $user->offers()->orderByDesc('id')->limit(10)->get();
        $transactions = $user->transaction()->orderByDesc('id')->limit(10)->get();

        return response()->json([
            'invoice' => InvoiceListResource::collection($invoices),
            'offer' => OfferListResource::collection($offers),
            'transaction' => TransactionsListResource::collection($transactions),
        ]);
    }

}
