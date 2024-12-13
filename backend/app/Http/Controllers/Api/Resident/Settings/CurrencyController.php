<?php


namespace App\Http\Controllers\Api\Resident\Settings;


use App\Http\Requests\Resident\Settings\CurrencyRequest;
use App\Http\Resources\Resident\Settings\CurrencyResource;
use App\Models\Config;
use App\Models\Resident\Settings\Currency;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\ValidationException;

class CurrencyController extends SettingsController
{
    public function currency(Request $request)
    {
        $currencyData = Currency::all();
        $paginate = $currencyData->paginate($this->amount ?? 6);

        return CurrencyResource::collection($paginate);
    }

    public function create(CurrencyRequest $request)
    {
        $curencyInfo = $request->getCurrency();

        $currency = Currency::withTrashed()->where('iso_code', $request->code)->first();

        if(!$currency) {
            $currency = new Currency();
        }
        $currency->cname = $request->code;
        $currency->iso_code = $request->code;
        $currency->symbol = $curencyInfo['symbol'];
        $currency->rate = floatval($request->rate);
        $currency->deleted_at = null;
        $currency->save();

        return response()->json(['success' => true]);
    }

    public function update(CurrencyRequest $request, Currency $currency)
    {
        $currency->cname = $request->code;
        $currency->iso_code = $request->code;
        $currency->rate = floatval($request->rate);
        $currency->save();

        return response()->json(['success' => true]);
    }

    public function updateBase(Request $request, Currency $currency)
    {
        $currency->isdefault = 1;
        $currency->save();

        Currency::query()->where('id', '!=', $currency->id)->update(['isdefault' => 0]);

        $info = $currency->getInfo();

        Config::set('home_currency', $currency->iso_code);
        Config::set('currency_code', $info['symbol']);
        Config::set('dec_point', $info['decimal_mark']);
        Config::set('thousands_sep', $info['thousands_separator']);
        Config::set('currency_symbol_position', $info['symbol_first'] ? 'p' : 's');

        Cache::forget('Currency.Default');

        return response()->json(['success' => true]);
    }

    public function delete(Request $request, Currency $currency)
    {
        if($currency->isdefault) {
            throw ValidationException::withMessages(["isdefault" => 'Unable to delete current item']);
        }
        $currency->delete();
        return response()->json(['success' => true]);
    }

}
