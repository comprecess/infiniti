<?php

namespace App\Services\Mail\Resources;


use App\Http\Resources\Traits\ListTrait;
use App\Models\Config;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceResource extends JsonResource
{
    use ListTrait;


    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $resource = [];

        $user = $this->user;
        $company = $user?->companyClient;

        $resource = array_merge($resource, [
            'invoice_url' => env('FRONT_URL') . '/public/invoice/view/' . $this->vtoken,
            'business_name' => Config::get('CompanyName'),
            'name' => $user?->account,
            'client_name' => $user?->account,
            'client_email' => $user?->email,
            'customer_name' => $user?->account,
            'company' => $company?->company_name,
            'invoice_pdf_url' => route('pdf', ['name' => 'invoice', 'token' => $this->vtoken]),
            'invoice_id' => $this->getCode(),
            'invoice_status' => $this->status,
            'invoice_amount_paid' => $this->printPrice('credit'),
            'invoice_due_amount' => $this->printPrice($this->duty()),
            'invoice_tax_amount' => $this->printPrice('tax'),
            'invoice_subtotal' => $this->printPrice('subtotal'),
            'invoice_amount' => $this->printPrice('total'),
            'invoice_due_date' => $this->duedate->format(Config::get('df')),
            'invoice_date' => $this->date->format(Config::get('df')),
            'id' => $this->id,
            'code' => $this->getCode(),
        ]);

        return $resource;
    }

}
