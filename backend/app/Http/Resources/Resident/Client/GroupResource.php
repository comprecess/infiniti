<?php

namespace App\Http\Resources\Resident\Client;

use App\Http\Resources\Contracts\ListInterface;
use App\Http\Resources\Traits\ListTrait;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GroupResource extends JsonResource implements ListInterface
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
        $this->setList($resorce);

        return $resorce;
    }

    public function getList(): array
    {
        return ['id', 'gname' => 'name', 'sorder' => 'sort'];
    }


}
