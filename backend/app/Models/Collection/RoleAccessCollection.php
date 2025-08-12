<?php


namespace App\Models\Collection;


use App\Models\MultipleConditions\InvoiceStatus;
use App\Models\Resident\Invoices\Invoice;
use App\Models\Resident\Settings\RoleAccess;
use Illuminate\Database\Eloquent\Collection;

class RoleAccessCollection extends Collection
{
    public function __get($key)
    {
        $newKey = null;
        if(in_array($key, RoleAccess::TYPE_ACCESS)) {
            $this->each(function($item) use(&$newKey, $key){
                if($newKey === null) {
                    $newKey = (bool) $item->{$key};
                }else{
                    $newKey = $newKey || (bool) $item->{$key};
                }
            });

            return $newKey;
        }
    }

}
