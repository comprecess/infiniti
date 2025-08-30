<?php


namespace App\Http\Controllers\Api\All;


use App\Http\Controllers\Controller;
use App\Http\Resources\Resident\Settings\CurrencyResource;
use App\Models\Resident\Settings\Currency;

class SettingsController extends Controller
{

    public function getDefaultCurrency()
    {
        return new CurrencyResource(Currency::getDefault());
    }
}
