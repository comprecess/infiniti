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
        $resorce = [
            'logo' => $this->getLastFile()?->getLink(),
        ];
        $this->setList($resorce);

        if (!self::$isCollection) {
            $resorce['country'] = array_search($this->country, Countries::list());
        }

        return $resorce;
    }


    public function getList(): array
    {
        $resorce = ['id', 'company_name' => 'name', 'code', 'email', 'phone'];

        if (!self::$isCollection) {
             $resorce = array_merge($resorce, [
                 'address1' => 'address',
                 'business_number' => 'businessNumber',
                 'url',
                 'city',
                 'state',
                 'zip'
             ]);
        }

        return $resorce;
    }

    public static function collection($resource)
    {
        self::$isCollection = true;
        return parent::collection($resource);
    }
}
