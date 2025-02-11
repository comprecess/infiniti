<?php

namespace App\Models;

use App\Models\BusinessModel\BusinessModel;
use App\Models\Contracts\ChatGPTContract;
use App\Models\Traits\BootTrait;
use App\Models\Traits\UserTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use OpenAI\Laravel\Facades\OpenAI;
use App\Services\ChatGPT as ChatGPTService;

class ChatGPT extends Model
{
    use HasFactory, UserTrait, BootTrait, SoftDeletes;

    const MODEL = [
        'gpt-4o',
        'gpt-4o-mini',
        'o1',
        'o1-mini',
        'o3-mini',
    ];

    const DISCUSSION_MODEL = [
        'businessModel' => BusinessModel::class
    ];

    protected $discussionModel = null;

    protected $table = 'chat_gpt';

    protected $adminColumn = 'admin_id';

    public static function creatingEvent($item)
    {
        do{
            $hash = hash('sha256', Hash::make(Str::random(100)));
        }while(self::where('chat_history_hash', $hash)->count() > 0);

        $item->chat_history_hash = $hash;
        $item->admin_id = auth()->id();
    }

    public function model()
    {
        return $this->morphTo('model');
    }

    public static function test($promt = null) {
        $result = OpenAI::chat()->create([
            'model' => 'gpt-4o',
            'messages' => [
//                ['role' => 'user', 'content' => 'У меня есть список сотрудников, у каждого есть свои характеристики и свойства. В каком формате мене предоставить тебе этот список?'],
                ['role' => 'user', 'content' => 'Напиши бизнес проект, связаный с веб технологиями. Ответ должен быть в xml формате. Опсание в теге <description>'],
            ],
        ]);

        dd($result);
    }

    public function scopeFindModel($query, ?string $class = null, ?int $id = null)
    {
        $class = Arr::get(self::DISCUSSION_MODEL, $class, null);
        if($class) {
            $query->where('model_type', $class);

            if($id) {
                $query->where('model_id', $id);
            }
        }
    }

    public function setDiscussionModel($model = null)
    {
        $this->discussionModel = $model;
        $this->model_type = get_class($model);
        $this->model_id = $model->id;
    }

    public function getDiscussionNumber()
    {
        return $this->admin_id . ($this->discussionModel ? "_" . $this->discussionModel->id : "");
    }

    public function discussionAboutModel()
    {
        $this->save();

        $chat = new ChatGPTService($this);
        $chat->setModel($this->chat_model);

        $history = $this->history();
        if($history?->count()){
            $chat->write("Наша с тобой история переписки в формате JSON: " . $history->toJson());
        }

        if($this->discussionModel instanceof ChatGPTContract) {
            $this->discussionModel->discussion($chat);
        }

        $chat->write($this->message);

        $model = $chat->send()->toModel();
        $model->save();

        $this->log_message = $chat->getHistory(2);
        $this->save();

        return $model;
    }

    public function send($promt = null, $model = null, $delet = false)
    {
        dump($promt);
//        return OpenAI::chat()->create([
//            'model' => $model ?? $this->chat_model ?? self::MODEL[0],
//            'messages' => [
//                ['role' => 'user', 'content' => $promt ?? $this->message],
//            ],
//        ]);
    }

    public function history() : ?Collection
    {
        $history = null;
        $query = ChatGPT::where('admin_id', $this->admin_id);

        if($this->model_id) {
            $query->where('model_type', $this->model_type)
                ->where('model_id', $this->model_id);
        }
        $result = $query->orderBy('id', 'desc')
            ->limit(21)
            ->with(['admin'])
            ->get();

        $result->forget(0);

        if($result->count()){
            $history = collect();

            $result->reverse()
                ->each(function($item) use(&$history){
                $history->push([
                    'user' => $item->parent_id ? "ChatGPT" : $item->admin->fullname,
                    'date' => $item->created_at->format("d.m.Y H:i:s"),
                    'message' => $item->message,
                ]);
            });
        }

        return $history;

    }

}
