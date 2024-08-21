<?php

namespace App\Http\Requests\Resident\Client\View;

use App\Models\Resident\Document;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FilesRequest extends FormRequest
{

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */

    public function rules(): array
    {
        if($this->method() == 'DELETE') {
            $this->merge(['id' => $this->route('id')]);
            return [
                'id' => [
                    'required',
//                    Rule::unique('ib_doc_rel','did')->where('rid', $this->route('client')->id)->where('rtype', Document::TYPE_CONTACT),
//                    'exists:sys_documents,id',
                    Rule::exists('ib_doc_rel', 'did')->where('rid', $this->route('client')->id)->where('rtype', Document::TYPE_CONTACT)
                ]
            ];

        }

        return [
//            'id' => "required|unique:ib_doc_rel,did",
            'id' => [
                'required',
                Rule::unique('ib_doc_rel','did')->where('rid', $this->route('client')->id)->where('rtype', Document::TYPE_CONTACT),
                'exists:sys_documents,id'
                ]
        ];
    }

    public function messages()
    {
        return [
            'id.unique' => __('my_validation.files_unique')
        ];
    }

}
