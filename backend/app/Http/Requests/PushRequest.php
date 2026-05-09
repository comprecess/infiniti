<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class PushRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'subscription' => 'required|string',
            'name'         => 'required|string',
            'p256dh'       => 'nullable|string',
            'auth'         => 'nullable|string',
        ];
    }
}
