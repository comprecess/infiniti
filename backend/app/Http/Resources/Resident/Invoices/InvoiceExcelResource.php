<?php

namespace App\Http\Resources\Resident\Invoices;



use App\Http\Resources\Resident\Client\ClientResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceExcelResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        return [
            'code' => $this->getCode(),
            'account' => $this->user->account . "\r\n" . $this->user?->companyClient?->company_name,
            'amount' => $this->printPrice('total'),
            'invoiceDate' => $this->date?->format('d/m/Y'),
            'dueDate' => $this->duedate?->format('d/m/Y'),
            'status' => $this->status,
            'type' => $this->r,
        ];
    }

}
