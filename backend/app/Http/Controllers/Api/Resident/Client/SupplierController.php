<?php


namespace App\Http\Controllers\Api\Resident\Client;


use App\Models\Users\Client;

class SupplierController extends ClientController
{
    protected $type = Client::TYPE[1];
}
