<?php

namespace App\Http\Resources\Resident\Client\ClientView;

use App\Models\Resident\Settings\CustomFields;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SummaryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $ti = $this->transactionPayer->profit();
        $te = $this->transactionPayee->expense();
        if ($ti > $te) {
            $amount = ['status' => 'green', 'amount' => $this->printPrice($ti - $te)];
        } else {
            $amount = ['status' => 'danger', 'amount' => $this->printPrice($te - $ti)];
        }

        $customFields = CustomFields::select(['crm_customfields.*', 'crm_customfieldsvalues.fvalue as value'])
            ->leftJoin('crm_customfieldsvalues', function($join){
                $join->on('crm_customfieldsvalues.fieldid', '=', 'crm_customfields.id')->where('crm_customfieldsvalues.relid', $this->id);
            })
            ->get();

        $data = [
            'id' => $this->id,
            'account' => $this->account,
            'group' => $this->group?->gname,
            'company' => $this->companyClient?->company_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'address' => $this->address,
            'city' => $this->city,
            'state' => $this->state,
            'zip' => $this->zip,
            'country' => $this->country,
            'tags' => $this->tags,
            'primaryContact' => $this->is_primary_contact,
            'notes' => $this->notes,
            'balance' => $this->printPrice('balance'),
            'autologin' => $this->getAutologin(),
            'customFields' => CustomFieldsResource::collection($customFields),
            'totalProfit' => $this->printPrice($ti),
            'totalExpense' => $this->printPrice($te),
            'amount' => $amount
        ];

        return $data;
    }


}
