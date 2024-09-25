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
            'toEmail' => 'required',
            'attachFile' => 'nullable',
            'bccEmail' => 'nullable',
            'ccEmail' => 'nullable',
        ];
    }

}
