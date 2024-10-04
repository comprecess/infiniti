<?php

namespace App\Services\Mail\Resources;


use App\Http\Resources\Traits\ListTrait;
use App\Models\Config;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OfferResource extends JsonResource
{
    use ListTrait;


    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $resorce = [];

        $user = $this->user;
        $company = $user?->companyClient;

        $resorce = array_merge($resorce, [
            'quote_url' => env('FRONT_URL') . '/public/offer/view/' . $this->vtoken,
            'business_name' => Config::get('CompanyName'),
            'name' => $user?->account,
            'contact_name' => $user?->account,
            'quote_subject' => $this->subject,
            'client_email' => $user?->email,
            'customer_name' => $user?->account,
            'company' => $company?->company_name,
            'pdf_url' => route('pdf', ['name' => 'offer', 'token' => $this->vtoken]),
            'id' => $this->id,
            'code' => $this->getCode(),
        ]);

        return $resorce;
    }

}
