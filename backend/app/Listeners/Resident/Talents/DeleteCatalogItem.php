<?php

namespace App\Listeners\Resident\Talents;

use App\Events\Resident\Talents\DeleteTalent;
use App\Models\Catalog\CartItem;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class DeleteCatalogItem
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(DeleteTalent $event): void
    {
        $cartalogUser = $event->getUser();
        CartItem::where('id_catalog_user', $cartalogUser->id)
            ->with(['cart'])
            ->get()
            ->each(function($item){
                if($item->cart) {
                    $item->delete();
                    if(!$item->cart->items()->count()) {
                        $item->cart->forceDelete();
                    }else{
                        $item->cart->calculation();
                    }
                }
            });
    }
}
