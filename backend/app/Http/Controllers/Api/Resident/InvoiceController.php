<?php


namespace App\Http\Controllers\Api\Resident;


use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Requests\Resident\Invoices\InvoiceListRequest;
use App\Http\Resources\Resident\Invoices\InvoiceExcelResource;
use App\Http\Resources\Resident\Invoices\InvoiceListResource;
use App\Http\Resources\Resident\Invoices\InvoicePdfResource;
use App\Models\Resident\Invoices\Invoice;
use App\Services\Document\DocumentVariables;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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

    public function getDocumentVariables(): DocumentVariables
    {
        $columns = [
            'code' => 'Code',
            'account' => 'Name and Company name',
            'amount' => 'Amount',
            'invoiceDate' => 'Invoice date',
            'dueDate' => 'Due date',
            'status' => 'Status',
            'type' => 'Type',
        ];

        $varibles = new DocumentVariables();

        $varibles->nameDocument = "Invoice";
        $varibles->header = "Invoice - Infiniti";
        $varibles->columns = $columns;
        $varibles->excelView = 'document.excel.resident-invoice';
        $varibles->resource = request()->input('document') == 'pdf' ? InvoicePdfResource::class : InvoiceExcelResource::class;


        return $varibles;
    }

    public function list(InvoiceListRequest $request)
    {

        #ДОСТУП

        $invoice = Invoice::query()
            ->select('sys_invoices.*')
            ->leftJoin('crm_accounts', 'crm_accounts.id', '=', 'sys_invoices.userid')
            ->leftJoin('sys_companies', 'sys_companies.id', '=', 'crm_accounts.cid')
            ->with(['user', 'user.companyClient', 'user.group']);

        $requestAll = $request->all();
        Log::alert('REQUEST', $requestAll);
        if($status = Arr::get($requestAll, 'filter.status')) {
            $invoice->where('sys_invoices.status', $status);
        }

        if(($search = Arr::get($requestAll, 'filter.search')) !== null) {
            $invoice->where(function($q) use ($search){
                $search = "%" . $search . "%";
                $q->where('sys_invoices.id', 'like', $search)
                    ->orWhere(DB::raw("CONCAT(`sys_invoices`.`invoicenum`, '', IF(`sys_invoices`.`cn` != '', `sys_invoices`.`cn`, `sys_invoices`.`id`))"), 'like', $search)
                    ->orWhere('crm_accounts.account', 'like', $search)
                    ->orWhere('sys_companies.company_name', 'like', $search)
                    ->orWhere('sys_invoices.total', 'like', $search)
                    ->orWhere(DB::raw("DATE_FORMAT(`sys_invoices`.`date`, '%d/%m/%Y')"), 'like', $search)
                    ->orWhere(DB::raw("DATE_FORMAT(`sys_invoices`.`duedate`, '%d/%m/%Y')"), 'like', $search);
            });
        }

        $request->sortModel($invoice);

        Log::alert('QUERY', [$invoice->toRawSql()]);

        return $this->index($invoice, InvoiceListResource::class, true);
    }


}
