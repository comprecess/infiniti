<?php

namespace App\Http\Requests\Public;

use App\Models\Catalog\Cart;
use App\Models\Resident\Invoices\Offer;
use Illuminate\Foundation\Http\FormRequest;

class OfferCheckRequest extends FormRequest
{

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $this->merge(['type' => $this->route('type')]);

        $stage = [Offer::STAGE['0'], Offer::STAGE['5']];

        return [
            'name' => 'nullable',
            'message' => 'nullable',
            'type' => 'required|in:offer',
            'stage' => 'required|in:' . implode(',', $stage)
        ];
    }
}
