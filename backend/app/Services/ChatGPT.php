<?php


namespace App\Services;


use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use OpenAI\Laravel\Facades\OpenAI;

class ChatGPT
{
    const MODEL = [
        'gpt-4o',
        'gpt-4.5',
        'gpt-4o-mini',
        'gpt-4o-search-preview',
        'gpt-4o-mini-search-preview',
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

    public function __construct(?\App\Models\ChatGPT $chatGPTModel = null)
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

    public function write($prompt, $ln = true)
    {
        if($ln) {
            $this->write[] = $prompt;
        } else {
            $this->write[count($this->write) - 1 < 0 ? 0 : count($this->write) - 1]  = $prompt;
        }
        return $this;
    }

    public function writeClear()
    {
        $this->write = [];
        return $this;
    }


    public function send($prompt = null, $model = null)
    {
        if(!$prompt && $this->write) {
            $prompt = implode("\n", $this->write);
        }

        $this->history[] = $prompt;

        try {
            $this->lastMessage = OpenAI::chat()->create([
                'model' => $model ?? $this->model,
                'messages' => [
                    ['role' => 'user', 'content' => $prompt],
                ],
            ])->toArray();

            $this->history[] = Arr::get($this->lastMessage, 'choices.0.message.content');

        }catch (\Exception $e) {
            Log::error($e->getMessage(), $e->getTrace());
            $this->error = $e->getMessage();
        }

        return $this;
    }

    public function getAnswer()
    {
        return $this->lastMessage;
    }

    public function getHistory($last = 1)
    {
        return $this->history[count($this->history) - $last] ?? null;
    }

    public function toModel(?\App\Models\ChatGPT $chatGPTModel = null) :?\App\Models\ChatGPT
    {
        $model = $this->chatGPTModel ?? $chatGPTModel;

        if(!$model) {
            return null;
        }

        if($this->lastMessage) {
            $message =  $this->getHistory();
            $log_message = null;
        } else {
            $message =  __('chat_gpt.message.error');
            $log_message = $this->error;
        }

        $analysis = Arr::get($model->data, 'analysis', []);

        if(!$log_message && count($analysis)) {
            $log_message = $message;
            $message = trim(preg_replace('/\{\/?([^\}]*)\}/', '', $message));
        }

        $chat = $model->replicate();
        $chat->id = null;
        $chat->parent_id = $model->id;
        $chat->chat_id = Arr::get($this->lastMessage, 'id', 'no_id_or_error');
        $chat->message = $message;
        $chat->log_message = $log_message;
        return $chat;
    }

    public function getTagInfo()
    {
        $message = $this->getHistory();
        preg_match_all('/\{\/?([^\}]*)\}/', $message, $preg);
        $result = [];

        if(count($preg)) {
            $uniqPreg = array_unique($preg[1]);
            foreach($uniqPreg as $tag) {
                $startSearch = "{{$tag}}";
                $endSearch = "{/{$tag}}";
                $start = mb_strpos($message, $startSearch);
                $end = mb_strpos($message, $endSearch);

                if($start !== null && $end !== null){
                    $calc = $start + strlen($startSearch);
                    $result[$tag] = trim(mb_substr($message, $calc, $end - $calc));
                }
            }
        }

        return $result;
    }
}
