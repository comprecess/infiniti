<?php

namespace App\Http\Requests\Resident;


use App\Models\ChatGPT;
use App\Services\ChatGPT as ChatGPTService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;

class ChatGPTRequest extends FormRequest
{

    public function rules(): array
    {
        $rules = [
            'discussionId' => 'nullable',
            'discussionModel' => 'nullable|in:' . implode(',',array_keys(ChatGPT::DISCUSSION_MODEL)),
            'chatModel' => 'nullable|in:' . implode(',',ChatGPTService::MODEL),
            'data' => 'nullable|array'
        ];

        if($this->method() !== 'GET') {
            $rules['message'] = 'required';
        }

        return $rules;
    }

    public function getModel()
    {

        $model = null;

        if($this->discussionModel) {
            $model = ChatGPT::DISCUSSION_MODEL[$this->discussionModel]['class'];
            if(!$this->user()->checkAccess('edit', ChatGPT::DISCUSSION_MODEL[$this->discussionModel]['access'])) {
                abort(403);
            }
            if($model) {
                $model = $this->discussionId ? ($model::find($this->discussionId)) ?? new $model() : new $model();
            }
        }

        return $model;
    }

    public function getChatGPT()
    {
        $model = $this->getModel();

        $chatGPT = $model?->chatGPT() ?? new ChatGPT();
        $chatGPT->chat_model = $this->chatModel ?? ChatGPTService::MODEL[0];
        $chatGPT->message = $this->message;

        return $chatGPT;
    }

    public function getChatGPTDiscussion()
    {
        $model = $this->getModel();
        if(!$model) {
            throw ValidationException::withMessages(["discussio1nModel" => __('validation.required', ['attribute' => 'discussionModel'])]);
        }

        $chatGPT = $model->chatGPT();
        $chatGPT->chat_model = $this->chatModel ?? ChatGPTService::MODEL[0];

        return $chatGPT;
    }

    public function getReadyPrompt()
    {
        if(!$this->namePrompt) {
            throw ValidationException::withMessages(["namePrompt" => __('validation.required', ['attribute' => 'namePrompt'])]);
        }

        $chat = $this->getChatGPTDiscussion();
        $chat->message = $this->message;
        $chat->namePrompt = $this->namePrompt;

        return $chat;
    }

}
