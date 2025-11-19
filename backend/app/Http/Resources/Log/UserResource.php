<?php

namespace App\Http\Resources\Log;

use App\Http\Resources\Contracts\ListInterface;
use App\Http\Resources\Resident\Settings\RoleResource;
use App\Http\Resources\Traits\ListTrait;
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
        $resource = [
            'id' => $this->id,
            'userType' => $this->getNameClass(),
        ];

        $this->setList($resource);
        return $resource;
    }

    public function getList(): array
    {
        $clint = (new Client())->getNameClass();
        if($this->isClient()) {
            return ['account', 'email'];
        } else {
            return ['fullname' => 'account', 'username' => 'email'];
        }

    }

    private function isClient()
    {
        return $this->getNameClass() == (new Client())->getNameClass();
    }
}
