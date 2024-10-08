<?php

namespace App\Http\Resources\Resident\Settings;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoleAccessResource extends JsonResource
{

    public function toArray(Request $request): array
    {

        return [
            'id' => $this->id,
            'shortname' => $this->shortname,
            'permission' => new RolePermissionResource($this->permission),
            'view' => $this->can_view,
            'edit' => $this->can_edit,
            'create' => $this->can_create,
            'delete' => $this->can_delete,
            'all' => $this->all_data,
        ];
    }
}
