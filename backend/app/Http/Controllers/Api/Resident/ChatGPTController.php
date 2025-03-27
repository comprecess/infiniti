<?php


namespace App\Http\Controllers\Api\Resident;


use App\Http\Requests\Resident\ChatGPTRequest;
use App\Http\Resources\Resident\ChatGPTResource;
use App\Models\ChatGPT;
use App\Models\Contracts\ChatGPTContract;
use App\Services\ChatGPT as ChatGPTService;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Arr;
use OpenAI\Laravel\Facades\OpenAI;

class ChatGPTController extends ResidentController
{
    public function historyUser(ChatGPTRequest $request)
    {
        $user = User::getAuth();

        $query = ChatGPT::where('admin_id', $user->id)
            ->whereNotNull('admin_id')
            ->orderBy('id', 'desc')
            ->paginate(25)
        ;
        /**
         * @var \Illuminate\Pagination\LengthAwarePaginator $query
         */

        $dataPage = $query->toArray();
        $paginat = new LengthAwarePaginator(
            $query->reverse(),
            $dataPage['total'],
            $dataPage['per_page'],
            $dataPage['current_page'],
            $dataPage
        );

        return ChatGPTResource::collection($paginat);
    }

    public function message(ChatGPTRequest $request)
    {
        $chatGPT = $request->getChatGPT()->analysisModelFields();
        $chatGPT->save();

        $chat = new ChatGPTService($chatGPT);
        $chat->setModel($chatGPT->chat_model);


        /******-1/
  /*
        $prompt = 'Твоя задача написать ответ, ';
        $block = [];

        if($chatGPT->discussionModel instanceof ChatGPTContract) {
            $prompt .= 'на тему ' . $chatGPT->discussionModel->discussionTopic();
            if($chatGPT->discussionModel->id) {
                $block['Свойства и характеристики'] = $chatGPT->discussionModel->modelDescription(config("data.chat_gpt.{$chatGPT->getDiscussionModelName()}"));
            }

        }

        $analysis = $chatGPT->getAnalysis();
        if(count($analysis)) {
            $prompt .= " по конкретному паттерну [Паттерн]";
            $pattern = "";
            foreach(array_keys($analysis) as $key) {
                $pattern .= "{{$key}}: Твой текст в разметке html{/{$key}}\n";
            }
            $block['Паттерн'] = $pattern;
        }

        $prompt .= " исходя из текста [Текст]";
        $block['Текст'] = $chatGPT->message;

        $history = $chatGPT->history();
        if($history?->count()){
            $prompt .= " и истории [История] нашей переписки";
            $block['История'] = $history->toChat();
        }

        $prompt .= ", не двигаясь вправо влево, не сочиняя что-то свое без лишних движений,";

        if(count($analysis)) {
            $prompt .= ' строго соблюдая паттерн.';
        }else{
            $prompt .= ".";
        }

//        $prompt .= " Повторюсь проанализируй [Текст] и напиши строго по патерну свой ответ, не дополняя ничего \n";
*/
        /******/

        $prompt = 'В поле текст [текст] описаны основне требование для тебя и что пользователь хочет получить. ';
        $block['текст'] = $chatGPT->message;

        $modelData = config("data.chat_gpt.{$chatGPT->getDiscussionModelName()}");

        if($chatGPT->discussionModel instanceof ChatGPTContract) {
            $prompt .= 'Дискуссия ведется по теме: ' . $chatGPT->discussionModel->discussionTopic();
            if($chatGPT->discussionModel->id) {
                $block[$chatGPT->discussionModel->discussionName()] = $chatGPT->discussionModel->modelDescription($modelData);
            }

        }

        $analysis = $chatGPT->getAnalysis();
        if(count($analysis)) {
            $prompt .= "\nТвой ответ должен выглядеть в виде паттерна [паттерн]";
            $pattern = "";
            foreach(array_keys($analysis) as $key) {
                $html = Arr::get($modelData, "{$key}.html", false) ? " в разметке html" : "";
                $pattern .= "{{$key}} Твой текст{$html} {/{$key}}\n";
            }
            $block['паттерн'] = $pattern;
        }

        $history = $chatGPT->history();
        if($history?->count()){
            $block['История'] = $history->toChat();
        }

        $prompt .= "\n";
        /******/

        $chat->write($prompt);

        foreach($block as $name => $value) {
            $chat->write("[{$name}]\n{$value}\n");
        }

        $model = $chat->send()->toModel();
        $model->save();

        $chatGPT->log_message = $chat->getHistory(2);
        $chatGPT->save();

        /*$chat = $request
            ->getChatGPT()
            ->discussionAboutModel();*/

        return new ChatGPTResource($model);
    }

    public function history(Request $request)
    {

        $chat = ChatGPT::where('chat_history_hash', $request->route('hash'))->firstOrFail();

        $query = ChatGPT::where('admin_id', $chat->admin_id);

        if($chat->model_id) {
            $query->where('model_type', $chat->model_type)
                ->where('model_id', $chat->model_id);
        }
        $query->orderBy('desc')
            ->limit(20);
    }

    public function inputData()
    {
        $data['chatGPTModel'] = ChatGPTService::MODEL;

        return response()->json($data);
    }

    public function analysis(ChatGPTRequest $request)
    {
        $user = User::getAuth();
        $model = $request->getModel();

        if(!$model) {
            return response()->json(['success' => false, 'message' => 'There is no discussion model'], 422);
        }

        $newModel = ChatGPT::DISCUSSION_MODEL[$request->discussionModel]['class'];
        $newModel = new $newModel();


        $answerQuery = ChatGPT::where('admin_id', $user->id)
            ->whereNull('chat_id')
            ->where('created_at', '>', now()->subDays(7))
            ->orderBy('id', 'desc');

        $answerQuery->where('model_type', get_class($model));
        if($model->id) {
            $answerQuery->where('model_id', $model->id);
        }

        $answer = $answerQuery->first();

        $analysis = Arr::get($answer?->data ?? [], 'analysis');
        $chat = $answer->child;

        if($analysis && $chat) {
            foreach($analysis as $column => $data) {
                $startSearch = "{{$column}}";
                $endSearch = "{/{$column}}";
                $start = mb_strpos($chat->log_message, $startSearch);
                $end = mb_strpos($chat->log_message, $endSearch);

                if($start !== null && $end !== null){
                    $calc = $start + strlen($startSearch);
                    $newModel->{$column} = trim(mb_substr($chat->log_message, $calc, $end - $calc));
                }
            }
        }
        $resource = $newModel->getResourceChat();
        $jsonResponse = json_decode((new $resource($newModel))->toJson(), true);
        foreach($jsonResponse as $key => $value) {
            if($value) {
                $jsonResponse[snakeCaseToPascalCase($key)] = $value;
            }
            unset($jsonResponse[$key]);
        }

        return response()->json($jsonResponse);
    }

    public function readyPrompt(ChatGPTRequest $request)
    {

        $chat = $request->getReadyPrompt();
        $prompt = $chat->toPrompt(request: $request);
        $chatGpt = null;

        if($prompt instanceof ChatGPTService) {
            $chatGpt = $prompt;
        } elseif(is_string($prompt)) {
            $chatGpt = new ChatGPTService($chat);
            $chatGpt->write($prompt);
        }

        if($prompt === null || $chatGpt === null) {
            return response()->json(['success' => false, 'message' => 'Prompt by name not found']);
        }

        $chatGpt->send();

        $response = $chat->toPrompt("{$chat->message}Response", $chatGpt, $request);
        if($response) {
            return $response;
        }

        return response()->json($chatGpt->getTagInfo());

    }

    public function test()
    {
//        ob_implicit_flush(false);
//        ob_end_flush();
        return response()->stream(function(){
            $stream =  OpenAI::chat()->createStreamed([
                'model' => ChatGPTService::MODEL[0],
                'messages' => [
                    ['role' => 'user', 'content' => "Придумай любой текст на 50 слов"],
                ],
            ]);


            foreach ($stream as $response) {
                $choice = Arr::first($response->choices);

                if (empty($choice->delta->content)) {
                    continue;
                }

                echo $choice->delta->content;
                ob_flush();
                flush();
            }

//            for($i = 0; $i < 10; $i++) {
//                echo "{$i}\n";
//                ob_flush();
//                flush();
//                sleep(1);
//            }

        }, 200, [
            'Cache-Control'     => 'no-cache, must-revalidate',
            'Content-Type'      => 'text/event-stream',
            'X-Accel-Buffering' => 'no',
            'Content-Encoding' => 'none',
        ]);
    }
}
