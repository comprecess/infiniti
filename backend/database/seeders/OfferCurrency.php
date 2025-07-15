<?php

namespace Database\Seeders;

use App\Models\Resident\Invoices\Offer;
use App\Models\Resident\Settings\Currency;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OfferCurrency extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Offer::chunk(50, function($offers){
           foreach ($offers as $offer) {
               $currency = Currency::find($offer->currency) ?? Currency::getDefault();
               $offer->currency_iso_code = $currency->iso_code;
               $offer->save();
           }
        });
    }
}
