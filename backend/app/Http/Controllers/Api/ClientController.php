<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Client\AddFundRequest;
use App\Http\Requests\User\Client\AvatarRequest;
use App\Http\Requests\User\Client\UpdateRequest;
use App\Http\Resources\Client\Invoice\InvoiceListResource;
use App\Http\Resources\Resident\Settings\CurrencyResource;
use App\Http\Resources\UserResource;
use App\Models\Config;
use App\Models\Log;
use App\Models\Resident\Invoices\Invoice;
use App\Models\Resident\Settings\Currency;
use App\Models\User;
use App\Services\Tools\Countries;
use Illuminate\Http\Request;


class ClientController extends UserController
{

    public function roleAccess(Request $request)
    {
        if(in_array($request->route()->getActionMethod(), ['index'])) {
            return true;
        }
    }

    public function index()
    {
        $this->isAuth(false);

        return new UserResource($this->user);
    }

    public function update(UpdateRequest $request)
    {
        $user = auth()->user();
        $request->setModel($user);

        if($request->password) {
            $user->setNewPassword($request->password);
        }

        $countries = Countries::list();
        if($request->country && isset($countries[$request->country])) {
            $user->country = $countries[$request->country];
        }

        $user->save();

        return response()->json(['success' => true]);

    }

    public function updateAvatar(AvatarRequest $request)
    {
        $user = auth()->user();
        $file = $user->uploads($request->file);
//        $user->files()->where('id', '!=', $file->id)->whereNull('data')->delete();
        $user->files()->where('id', '!=', $file->id)->whereNull('data')->get()->each(function($item){
            $item->delete();
        });

        return response()->json(['success' => true]);
    }

    public function inputData()
    {
        $user = User::getAuth();
        $defCurrency = Currency::getDefault();
        $currency = $user->getCurrencyIso ?? $defCurrency;

        $min = Config::get('add_fund_minimum_deposit');
        $max = Config::get('add_fund_maximum_deposit');

        return response()->json([
            'currency' => new CurrencyResource($currency),
            'min' =>(int) $defCurrency->transform((int) $min, $currency),
            'max' =>(int) $defCurrency->transform((int) $max, $currency),
        ]);
    }

    public function addFund(AddFundRequest $request)
    {
        $user = User::getAuth();
        $defCurrency = Currency::getDefault();
        $currency = $user->getCurrencyIso ?? $defCurrency;

        $amount = $request->amount;
        $invoice = Invoice::createItem($amount, $currency, 'Credit', 'AddFund');
        return new InvoiceListResource($invoice);
    }
}
