<?php

namespace App\Http\Requests\Resident;


use App\Http\Controllers\Api\Resident\BusinessPlan\BusinessModelController;
use App\Models\ChatGPT;
use App\Services\ChatGPT as ChatGPTService;
use Illuminate\Foundation\Http\FormRequest;

class ChatGPTRequest extends FormRequest
{

    public function rules(): array
    {
        $rules = [
            'discussionId' => 'nullable',
            'discussionModel' => 'nullable|in:' . implode(',',array_keys(ChatGPT::DISCUSSION_MODEL)),
            'chatModel' => 'nullable|in:' . implode(',',ChatGPTService::MODEL),
        ];

        if($this->method() !== 'GET') {
            $rules['message'] = 'required';
        }

        return $rules;
    }

    public function getChatGPT()
    {
        $accessData = array_combine(
            array_keys(ChatGPT::DISCUSSION_MODEL),
            [
                BusinessModelController::class
            ]
        );

        $model = null;

        if($this->discussionModel) {
            $access = $accessData[$this->discussionModel];
            $model = ChatGPT::DISCUSSION_MODEL[$this->discussionModel];
            if(!$this->user()->checkAccess('edit', $access)) {
                abort(403);
            }
            if($model) {
                $model = $this->discussionId ? $model::find($this->discussionId) : new $model;
            }
        }

        $chatGPT = $model?->chatGPT() ?? new ChatGPT();
        $chatGPT->chat_model = $this->chatModel ?? ChatGPTService::MODEL[0];
        $chatGPT->message = $this->message;

        return $chatGPT;
    }

}
