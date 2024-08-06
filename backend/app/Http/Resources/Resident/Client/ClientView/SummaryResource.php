<?php

namespace App\Http\Resources\Resident\Client\ClientView;

use App\Http\Resources\Resident\Settings\CustomFieldsResorce;
use App\Models\Collection\TransactionCollection;
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
            $amount = ['status' => 'green', 'ammount' => $this->printPrice($ti - $te)];
        } else {
            $amount = ['status' => 'danger', 'ammount' => $this->printPrice($te - $ti)];
        }

        $data = [
            'id' => $this->id,
            'account' => $this->account,
            'email' => $this->email,
            'phone' => $this->phone,
            'address' => $this->address,
            'city' => $this->city,
            'state' => $this->state,
            'zip' => $this->zip,
            'country' => $this->country,
            'primaryContact' => $this->is_primary_contact,
            'notes' => $this->notes,
            'autologin' => $this->getAutologin(),
            'customFields' => CustomFieldsResorce::collection($this->customFieldsValues),
            'totalProfit' => $this->printPrice($ti),
            'totalExpense' => $this->printPrice($te),
            'amount' => $amount
        ];

        return $data;
    }


}
