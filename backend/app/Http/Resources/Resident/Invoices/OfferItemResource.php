<?php

namespace App\Http\Resources\Resident\Invoices;

use App\Http\Requests\Resident\Invoices\InvoiceRequest;
use App\Http\Resources\Contracts\ListInterface;
use App\Http\Resources\Resident\Client\ClientView\SummaryResource;
use App\Http\Resources\Resident\Settings\CurrencyResource;
use App\Http\Resources\Traits\ListTrait;
use App\Http\Resources\Resident\Client\ClientResource;
use App\Models\Config;
use App\Models\Resident\Invoices\Invoice;
use App\Models\Resident\Invoices\Offer;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OfferItemResource extends JsonResource implements ListInterface
{
    use ListTrait;

    public static $isCollection = false;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        $resource = [];
        $this->setList($resource);

        if($this->id) {
            $items = $this->items()->with(['document', 'getCurrencyIso', 'currencyHistory'])->get();
        }else{
            $items = $this->items;
        }
        $currency = $this->getCurrencyIso;

        $resource = array_merge($resource, [
            'code' => $this->getCode(),
            'client' => new ClientResource($this->user),
            'dateCreated' => $this->datecreated?->format('Y-m-d'),
            'validUntil' => $this->validuntil?->format('Y-m-d'),
            'blank' => InvoiceBlankResource::collection($items),
            'pdf' => route('pdf', ['name' => 'offer', 'token' => $this->vtoken]),
            'checkPublic' => $this->check_public,
            'status' => [
                "publicButton" => $this->status()->actionPublicStage()
            ],
            'blankCalc' => [
                'price' => $this->printPrice($items->summPrice($currency),$currency),
                'discount' => $this->printPrice($items->summDiscount($currency),$currency),
                'tax' => $this->printPrice($items->summTax($currency),$currency),
                'total' => $this->printPrice($items->summTotal($currency),$currency)
            ]
        ]);

        $this->typeContent($resource, $request);

        if($this->getPublicToken && $this->checkPublic) {
            $resource['client'] = null;
        }

        return $resource;
    }


    public function getList(): array
    {
        $resource = ['id', 'subject', 'stage', 'proposal', 'customernotes' => 'notes', 'invoicenum' => 'offerNum', 'cn'=>'num', 'vtoken' => 'token'];

        return $resource;
    }

    public static function collection($resource)
    {
        self::$isCollection = true;
        return parent::collection($resource);
    }

    public function typeContent(&$resource, $request)
    {
        if($request->type == 'view') {
            $resource['client'] = new SummaryResource($this->user?->load(['group', 'companyClient', 'transactionPayer', 'transactionPayee']));
            $resource['company'] = ['companyName' => Config::get('CompanyName'), 'companyAddress' => Config::get('caddress')];
            $resource['listStage'] = Offer::STAGE;
        }
    }
}
