<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\Client\Invoice\InvoiceListResource;
use App\Models\User;
use App\Http\Controllers\Api\Traits\CRUD;


class InvoiceController extends Controller
{
    use CRUD;

    public function list()
    {
        $query = User::getAuth()->invoices()
            ->with(['getCurrencyIso'])
            ->orderBy('id', 'desc')
            ->limit(50);

        return $this->index($query, InvoiceListResource::class, true);
    }



}
