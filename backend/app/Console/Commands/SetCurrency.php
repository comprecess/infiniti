<?php

namespace App\Console\Commands;

use App\Models\Resident\Settings\Currency;
use App\Models\Resident\Settings\CurrencyHistory;
use App\Services\Currency\Contract\CurrencyServiceContract;
use App\Services\Currency\Dto;
use Illuminate\Console\Command;

class SetCurrency extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:set-currency';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Currency Service. Setting up a currency rate';

    /**
     * Execute the console command.
     */
    public function handle(CurrencyServiceContract $currencyService)
    {
        $currency = Currency::withTrashed()->get();
        $curData = new Dto();
        $date = now();

        $curData->set($currency->pluck('iso_code')->all());
        $rates = $currencyService->setDto($curData)
            ->currentRate()
            ->getRate();


        $currency->each(function ($item) use($rates, $date){
            if(isset($rates[$item->iso_code])) {
                $item->rate = $rates[$item->iso_code];
                $item->save();

                $history = new CurrencyHistory();
                $history->iso_code = $item->iso_code;
                $history->rate = $rates[$item->iso_code];
                $history->date = $date;
                $history->save();
            }
        });
    }
}
