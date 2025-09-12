<?php

namespace App\Http\Resources\Resident\Invoices;

use App\Http\Resources\Contracts\ListInterface;
use App\Http\Resources\Traits\ListTrait;
use App\Http\Resources\Resident\Client\ClientResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceResource extends JsonResource implements ListInterface
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
        $resource = [
            'nameId' => $this->invoicenum . " " . $this->cn ? $this->cn : $this->id,
            'account' => new ClientResource($this->user)
        ];
        $this->setList($resource);

        if (!self::$isCollection) {
            $resource['country'] = $this->country;
        }

        return $resource;
    }


    public function getList(): array
    {
        $resource = ['id', 'total', 'code', 'email', 'phone', 'notes'];

        return $resource;
    }

    public static function collection($resource)
    {
        self::$isCollection = true;
        return parent::collection($resource);
    }
}
