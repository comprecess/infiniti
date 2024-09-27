<?php

namespace App\Http\Requests\Resident\Invoices;


use App\Http\Requests\Resident\DocumentRequest;
use Illuminate\Support\Facades\DB;


class OfferListRequest extends DocumentRequest
{

    public function sort(): array
    {
        return [
            'id' => 'sys_quotes.id',
            'code' => 'sortCode',
            'account' => 'crm_accounts.account',
            'subject' => 'sys_quotes.subject',
            'total' => 'sys_quotes.total',
            'dateCreated' => 'sys_quotes.datecreated',
            'validUntil' => 'sys_quotes.validuntil',
            'stage' => 'sys_quotes.stage',
        ];
    }

    protected function sortCode()
    {
        return DB::raw("IF(`sys_quotes`.`cn` != '', `sys_quotes`.`cn`, `sys_quotes`.`id`) * 1");
    }


}
