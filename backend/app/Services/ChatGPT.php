<?php


namespace App\Services;


use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use OpenAI\Laravel\Facades\OpenAI;

class ChatGPT
{
    const MODEL = [
        'gpt-4o',
        'gpt-4o-mini',
        'o1',
        'o1-mini',
        'o3-mini',
    ];

    private $model = null;
    private $chatGPTModel = null;
    private $write = [];
    private $history = [];
    private $lastMessage = null;
    private $error = null;

    public function __construct(\App\Models\ChatGPT $chatGPTModel)
    {
        $this->model = self::MODEL[0];
        $this->chatGPTModel = $chatGPTModel;
    }

    public function setModel($model)
    {
        if(in_array($model, self::MODEL)) {
            $this->model = $model;
        }

        return $this;
    }

    public function write($promt, $ln = true)
    {
        if($ln) {
            $this->write[] = $promt;
        } else {
            $this->write[count($this->write) - 1 < 0 ? 0 : count($this->write) - 1]  = $promt;
        }
        return $this;
    }

    public function writeClear()
    {
        $this->write = [];
        return $this;
    }


    public function send($promt = null, $model = null)
    {
        if(!$promt && $this->write) {
            $promt = implode("\n", $this->write);
        }

        $this->history[] = $promt;

        try {
            $this->lastMessage = OpenAI::chat()->create([
                'model' => $model ?? $this->model,
                'messages' => [
                    ['role' => 'user', 'content' => $promt],
                ],
            ])->toArray();

            $this->history[] = Arr::get($this->lastMessage, 'choices.0.message.content');

        }catch (\Exception $e) {
            Log::error($e->getMessage(), $e->getTrace());
            $this->error = $e->getMessage();
        }

        return $this;
    }

    public function getHistory($last = 1)
    {
        return $this->history[count($this->history) - $last] ?? null;
    }

    public function toModel() :\App\Models\ChatGPT
    {
        if($this->lastMessage) {
            $message =  $this->getHistory();
            $log_message = null;
        } else {
            $message =  __('chat_gpt.message.error');
            $log_message = $this->error;
        }

        $chat = $this->chatGPTModel->replicate();
        $chat->id = null;
        $chat->parent_id = $this->chatGPTModel->id;
        $chat->chat_id = Arr::get($this->lastMessage, 'id');
        $chat->message = $message;
        $chat->log_message = $log_message;
        return $chat;
    }
}
