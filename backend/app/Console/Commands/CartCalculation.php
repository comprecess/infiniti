<?php

namespace App\Console\Commands;

use App\Models\Catalog\Cart;
use Illuminate\Console\Command;

class CartCalculation extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:cart-calculation';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        Cart::all()->each(function($cart){
            $cart->calculation();
        });
    }
}
