<?php

namespace App\Http\Requests\Resident\Invoices;


use App\Models\Resident\Invoices\Invoice;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;


class InvoiceListRequest extends FormRequest
{
    const SORT = [
        'id' => 'sys_invoices.id',
        'code' => 'sortCode',
        'account' => 'crm_accounts.account',
        'amount' => 'sys_invoices.total',
        'invoiceDate' => 'sys_invoices.date',
        'dueDate' => 'sys_invoices.duedate',
        'status' => 'sys_invoices.status',
        'type' => 'sys_invoices.r'
    ];

    const DOCUMENT = ['json', 'pdf', 'excel', 'csv', 'copy'];



    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */

    public function rules(): array
    {
        return [
            'filter.status' => "nullable|in:". implode(",", Invoice::STATUS),
            'filter.search' => "nullable|string",
            'sort.name' => "nullable|in:" . implode(",", array_keys(self::SORT)),
            'document' => "nullable|in:" . implode(",", self::DOCUMENT),
        ];
    }

    public function sortModel($model)
    {
        $desc = isset($this->sort['type']) ? (bool) $this->sort['type'] : true;
        if(method_exists($this, self::SORT[$this->sort['name'] ?? 'id'])) {
            $method = self::SORT[$this->sort['name'] ?? 'id'];
            $model->orderBy($this->{$method}(), $desc ? "desc" : 'asc');
        } else {
            $model->orderBy(self::SORT[$this->sort['name'] ?? 'id'], $desc ? "desc" : 'asc');
        }
    }

    private function sortCode()
    {
        return DB::raw("IF(`sys_invoices`.`cn` != '', `sys_invoices`.`cn`, `sys_invoices`.`id`) * 1");
    }

    public function filter($invoice)
    {
        $invoice->select('sys_invoices.*')
            ->leftJoin('crm_accounts', 'crm_accounts.id', '=', 'sys_invoices.userid')
            ->leftJoin('sys_companies', 'sys_companies.id', '=', 'crm_accounts.cid')
            ->with(['user', 'user.companyClient', 'user.group']);

        $requestAll = $this->all();

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

        $this->sortModel($invoice);
    }


}
