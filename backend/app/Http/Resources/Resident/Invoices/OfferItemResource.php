<?php

namespace App\Http\Resources\Resident\Invoices;

use App\Http\Requests\Resident\Invoices\InvoiceRequest;
use App\Http\Resources\Contracts\ListInterface;
use App\Http\Resources\Resident\Client\ClientView\SummaryResource;
use App\Http\Resources\Resident\Settings\CurrencyResorce;
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
        $resorce = [

        ];
        $this->setList($resorce);

        $items = $this->items;

        $resorce = array_merge($resorce, [
            'code' => $this->getCode(),
            'client' => new ClientResource($this->user),
            'dateCreated' => $this->datecreated?->format('Y-m-d'),
            'validUntil' => $this->validuntil?->format('Y-m-d'),
            'blank' => InvoiceBlankResource::collection($items),
            'pdf' => route('pdf', ['name' => 'offer', 'token' => $this->vtoken]),
            'blankCalc' => [
                'price' => $items->summPrice(),
                'discount' => $items->summDiscount(),
                'tax' => $items->summTax(),
                'total' => $items->summTotal()
            ]
        ]);

        $this->typeContent($resorce, $request);

        return $resorce;
    }


    public function getList(): array
    {
        $resorce = ['id', 'subject', 'stage', 'proposal', 'customernotes' => 'notes', 'invoicenum' => 'offerNum', 'cn'=>'num', 'vtoken' => 'token'];

        return $resorce;
    }

    public static function collection($resource)
    {
        self::$isCollection = true;
        return parent::collection($resource);
    }

    public function typeContent(&$resorce, $request)
    {
        if($request->type == 'view') {
            $resorce['client'] = new SummaryResource($this->user->load(['group', 'companyClient', 'transactionPayer', 'transactionPayee']));
            $resorce['company'] = ['companyName' => Config::get('CompanyName'), 'companyAddress' => Config::get('caddress')];
            $resorce['listStage'] = Offer::STAGE;
        }
    }
}
