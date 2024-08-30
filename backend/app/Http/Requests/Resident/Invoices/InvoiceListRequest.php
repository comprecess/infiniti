<?php

namespace App\Http\Requests\Resident\Invoices;


use App\Models\Resident\Invoices\Invoice;
use Illuminate\Foundation\Http\FormRequest;
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


}
