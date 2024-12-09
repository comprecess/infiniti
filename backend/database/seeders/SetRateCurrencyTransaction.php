<?php

namespace Database\Seeders;

use App\Models\Resident\Settings\Currency;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SetRateCurrencyTransaction extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cur = DB::table('sys_transactions')->select(['currency_iso_code'])->groupBy('currency_iso_code')->get();
        $curList = $cur->pluck('currency_iso_code');
        $curList->each(function($item){
            $currency = Currency::withTrashed()->where('iso_code', $item)->first();
            $code = $currency?->iso_code;
            $rate = $currency?->rate;
            if(!$currency) {
                $currency = Currency::getAndCreate($item);
                if(is_string($currency)) {
                    $currency = Currency::getDefault();
                }
                $code = $item;
                $rate = $currency?->rate;
            }
            DB::table('sys_transactions')
                ->where('currency_iso_code', $code)
                ->update(['currency_rate' => $rate]);
        });
//        $currency = Currency::withTrashed()->whereIn('iso_code', $curList->all())->get();
//
//        $currency->each(function($item){
//            DB::table('sys_transactions')
//                ->where('currency_iso_code', $item->iso_code)
//                ->update(['currency_rate' => $item->rate]);
//        });
    }
}
