<?php

namespace App\Models;

use App\Models\BusinessModel\BusinessModel;
use App\Models\Collection\ChatGPTCollection;
use App\Models\Contracts\ChatGPTContract;
use App\Models\KnowledgeBase;
use App\Models\Resident\BusinessPlan;
use App\Models\Traits\BootTrait;
use App\Models\Traits\CollectionTrait;
use App\Models\Traits\UserTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Services\ChatGPT as ChatGPTService;

class ChatGPT extends Model
{
    use HasFactory, UserTrait, BootTrait, SoftDeletes, CollectionTrait;

    const MODEL = [
        'gpt-4o',
        'gpt-4o-mini',
        'o1',
        'o1-mini',
        'o3-mini',
    ];

    const DISCUSSION_MODEL = [
        'businessModel'  => ['class' => BusinessModel::class,  'access' => 'business_plan'],
        'businessPlan'   => ['class' => BusinessPlan::class,   'access' => 'business_plan'],
        'knowledgeBase'  => ['class' => KnowledgeBase::class,  'access' => null],
    ];

    public $discussionModel = null;

    public $namePrompt = null;

    protected $table = 'chat_gpt';

    protected $adminColumn = 'admin_id';

    protected $casts = [
        'data' => 'json',
    ];

    public $collection = ChatGPTCollection::class;

    public static function creatingEvent($item)
    {
        do{
            $hash = hash('sha256', Hash::make(Str::random(100)));
        }while(self::where('chat_history_hash', $hash)->count() > 0);

        $item->chat_history_hash = $hash;
        // Only set admin_id if not a client-side record
        if (empty($item->client_id)) {
            $item->admin_id = auth()->id();
        }
    }

    public function model()
    {
        return $this->morphTo('model');
    }

    public function child()
    {
        return $this->hasOne(self::class, 'parent_id');
    }

    public function scopeFindModel($query, ?string $class = null, ?int $id = null)
    {
        if($class) {
            $class = Arr::get(self::DISCUSSION_MODEL, $class, null);
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
        $model?->save();

        $this->log_message = $chat->getHistory(2);
        $this->save();

        return $model;
    }

    public function analysisModelFields()
    {
        if(!$this->model_type) {
            return $this;
        }

        $tables = config('data.chat_gpt');
        $columns = null;
        foreach($tables as $table => $value) {
            if(self::DISCUSSION_MODEL[$table]['class'] == $this->model_type) {
                $columns = $value;
            }
        }

        $searchText = [];
        foreach($columns as $column => $values) {
            $text = $this->message;
            foreach($values['parse'] ?? [] as $word) {
                $position = false;
                $length = 0;
                do {
//                    dump($column, $word,$position, $text);
                    if($position !== false) {
//                        dump($length, $position, strlen($word));
                        $length = $length + $position + strlen($word);
                        $text = mb_substr($text, $position + strlen($word));
                        $searchText[$column][] = ['position' => $length, 'word' => $word];

                    }
                } while (($position = mb_strpos(strtolower($text), $word)) !== false);
            }

        }

        $data = $this->data ?? [];
        $data['analysis'] = $searchText;
        $this->data = $data;
        return $this;
    }

    public function getAnalysis()
    {
        return Arr::get($this->data ?? [], 'analysis', []);
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

        return $result->reverse();


    }

    public function getDiscussionModelName() :?string
    {
        foreach(self::DISCUSSION_MODEL as $key => $value){
            if($value['class'] == $this->model_type) {
                return $key;
            }
        }

        return null;
    }

    public function toPrompt(?string $method = null, mixed $data = null, $request = null)
    {
        $method = $method ?? $this->namePrompt ?? $this->message;
        if(!$this->discussionModel || !$method) {
            return null;
        }

        try {
            $class = explode("\\", $this->model_type);
            $class = $class[count($class) - 1];
            $class = "App\\Services\\ChatGPT\\Prompts\\{$class}";
            if(!class_exists($class)) {
                return null;
            }
            $class = new $class();

            if(method_exists($class, $method)) {
                return $class->{$method}($this, $data, $request);
            }

        }catch (\Exception $e) {
            return null;
        }

        return null;
    }

}
