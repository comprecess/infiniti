<?php

namespace App\Http\Resources\Resident\Settings;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomFieldsResorce extends JsonResource
{

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->fieldname,
            'type' => $this->fieldtype,
            'description' => $this->description,
            'fieldOptions' => $this->fieldoptions,
            'regexpr' => $this->regexpr,
            'showInvoice' => $this->showinvoice,
        ];
    }
}
