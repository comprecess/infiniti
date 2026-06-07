<?php
namespace App\Http\Resources;
use App\Http\Resources\Contracts\ListInterface;
use App\Http\Resources\Resident\Settings\RoleResource;
use App\Http\Resources\Traits\ListTrait;
use App\Models\Catalog\User as CatalogUser;
use App\Models\Users\Admin;
use App\Models\Users\Client;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
class UserResource extends JsonResource implements ListInterface
{
    use ListTrait;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Handle Catalog\User (AI Workforce) separately
        if($this->resource instanceof CatalogUser){
            return $this->toCatalogUserArray();
        }

        $resource = [
            'id' => $this->id,
            'userType' => $this->getNameClass(),
        ];
        $this->setList($resource);
        $resource['img'] = $this->getAvatar(true) ?? "";
//        if($this->getNameClass() == (new Client())->getNameClass()) {
//            $resource['company'] = $this->companyClient?->company_name;
//        }
        if($this->resource instanceof Admin){
            $resource['role'] = $this->myRole?->getRoleAccess();
        }else{
            $resource['balance'] = $this->printPrice('balance');
            $resource['company'] = $this->companyClient?->company_name;
            $resource['status'] = ['isSupplier' => $this->isType(), 'isCustomer' => $this->isType(Client::TYPE[0])];
        }
        return $resource;
    }

    /**
     * Transform a Catalog\User (AI Worker) into the standard user array format.
     */
    protected function toCatalogUserArray(): array
    {
        $props = $this->resource->getPropsByNameId(['priceHour', 'priceDay']);
        $hourlyRate = 0;
        $dailyRate = 0;
        foreach ($props as $prop) {
            $val = $prop->values->first()?->value ?? 0;
            if ($prop->id_name === 'priceHour') {
                $hourlyRate = (float) $val;
            } elseif ($prop->id_name === 'priceDay') {
                $dailyRate = (float) $val;
            }
        }

        return [
            'id' => $this->resource->id,
            'userType' => 'CatalogUser',
            'account' => $this->resource->name,
            'img' => $this->resource->getLastFile(true) ?? "",
            'isAiWorker' => true,
            'hourlyRate' => (float) $hourlyRate,
            'dailyRate' => (float) $dailyRate,
            'jobTitle' => $this->getCatalogUserJobTitle(),
        ];
    }

    /**
     * Get the job title for a Catalog User from their specialization value.
     */
    protected function getCatalogUserJobTitle(): string
    {
        $values = $this->resource->values()->with('prop')->get();
        $spec = $values->first(function ($v) {
            return $v->prop && $v->prop->id_name === 'specialization';
        });
        return $spec?->value ?? '';
    }

    public function getList(): array
    {
        if($this->resource instanceof CatalogUser){
            return ['name' => 'account', 'img'];
        }
        if($this->getNameClass() == (new Client())->getNameClass()) {
            return ['account', 'company', 'business_number' => 'businessNumber', 'phone', 'email', 'address', 'city', 'state', 'zip', 'country', 'notes', 'tags', 'img', 'lastlogin' => 'lastLogin'];
        } else {
            return ['username' => 'email', 'fullname' => 'account', 'phonenumber' => 'businessNumber', 'last_activity' => 'lastActivity', 'img', 'roleid' => 'roleId', 'role', 'language', 'job_title' => 'jobTitle', 'pay_frequency' => 'payFrequency', 'currency', 'amount', 'address_line_1' => 'addressLine1', 'address_line_2' => 'addressLine2', 'city', 'state', 'zip', 'country', 'summary'];
        }
    }
}
