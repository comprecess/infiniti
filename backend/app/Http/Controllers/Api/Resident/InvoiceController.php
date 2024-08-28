<?php


namespace App\Http\Controllers\Api\Resident;


use App\Http\Controllers\Api\Traits\CRUD;
use App\Models\Resident\Invoices\Invoice;

class InvoiceController extends ResidentController
{
    use CRUD;

    public function stat()
    {
        #ДОСТУП

        $stat = Invoice::smallStat();

        foreach($stat as &$value) {
            $column = $value['status'] == 'Partially Paid' ? 'credit' : 'total';
            $total = 0;
            $value['build']->get()->each(function($item) use($column, &$total){
                $total += $item->transformPrice($column);
            });
            $value['total'] = (new Invoice())->setCurrency()->printPrice($total);
            unset($value['build']);
        }

        return response()->json(['data' => $stat]);

    }

//    public function list(ClientListRequest $request)
//    {
//        $clients = Invoice::query()
//            ->select('sys_invoices.*')
//            ->leftJoin('crm_account', 'crm_account.id', '=', 'sys_invoices.userid')
//            ->with(['user']);
//
//        $requestAll = $request->all();
//        if($group = Arr::get($requestAll, 'filter.group')) {
//            $clients->where('gid', $group);
//        }
//
//        if($search = Arr::get($requestAll, 'filter.search')) {
//            $clients->where(function($q) use ($search){
//                $search = "%" . $search . "%";
//                $q->where('sys_invoices.id', 'like', $search)
//                    ->orWhere('sys_invoices.code', 'like', $search)
//                    ->orWhere('crm_accounts.email', 'like', $search)
//                    ->orWhere('crm_accounts.phone', 'like', $search)
//                    ->orWhere('crm_groups.gname', 'like', $search)
//                    ->orWhere('sys_companies.company_name', 'like', $search);
//            });
//        }
//
//        $request->sortModel($clients);
//
//        return $this->index($clients, ClientResource::class, true);
//    }


}
