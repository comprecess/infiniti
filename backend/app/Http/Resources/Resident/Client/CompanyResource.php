<?php

namespace App\Http\Resources\Resident\Client;

use App\Http\Resources\Contracts\ListInterface;
use App\Http\Resources\Traits\ListTrait;
use App\Services\Tools\Countries;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanyResource extends JsonResource implements ListInterface
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
            'logo' => $this->getLastFile()?->getLink(),
        ];
        $this->setList($resource);
        $resource['memo'] = $this->memo ?? '';

        if (!self::$isCollection) {
            $resource['country'] = $this->country;
        }

        return $resource;
    }


    public function getList(): array
    {
        $resource = ['id', 'company_name' => 'name', 'code', 'email', 'phone'];

        if (!self::$isCollection) {
             $resource = array_merge($resource, [
                 'address1' => 'address',
                 'business_number' => 'businessNumber',
                 'url',
                 'city',
                 'state',
                 'zip'
             ]);
        }

        return $resource;
    }

    public static function collection($resource)
    {
        self::$isCollection = true;
        return parent::collection($resource);
    }
}
