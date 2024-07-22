<?php


namespace App\Http\Controllers\Api\Resident\Settings;


use App\Http\Requests\Resident\Settings\CurrencyRequest;
use App\Http\Resources\Resident\Settings\CurrencyResorce;
use App\Models\Config;
use App\Models\Resident\Settings\Currency;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class CurrencyController extends SettingsController
{
    public function currency(Request $request)
    {
        $currencyData = Currency::all();
        $paginate = $currencyData->paginate($this->amount ?? 6);

        return CurrencyResorce::collection($paginate);
    }

    public function create(CurrencyRequest $request)
    {
        $curencyInfo = $request->getCurrency();

        $currency = new Currency();
        $currency->cname = $request->code;
        $currency->iso_code = $request->code;
        $currency->symbol = $curencyInfo['symbol'];
        $currency->rate = floatval($request->rate);
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

        return response()->json(['success' => true]);
    }

    public function delete(Request $request, Currency $currency)
    {
        $currency->delete();
        return response()->json(['success' => true]);
    }

}
