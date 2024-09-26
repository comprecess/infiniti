<?php

namespace App\Services\Mail\Requests;




use Illuminate\Foundation\Http\FormRequest;


class MailSendRequest extends FormRequest
{

    public function rules(): array
    {
        return [
            'message' => 'required',
            'subject' => 'required',
            'toEmail' => 'required|email',
            'attachFile' => 'nullable',
            'bccEmail' => 'nullable|email',
            'ccEmail' => 'nullable|email',
        ];
    }

}
