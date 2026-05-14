<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\Resident\ChatGPTResource;
use App\Models\ChatGPT;
use App\Models\KnowledgeBase;
use App\Models\User;
use App\Services\ChatGPT as ChatGPTService;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class KnowledgeBaseController extends Controller
{
    public function inputData()
    {
        return response()->json([
            'chatGPTModel' => ChatGPTService::MODEL,
        ]);
    }

    public function history()
    {
        $user = User::getAuth();
        $knowledgeBase = new KnowledgeBase();

        $query = ChatGPT::where('client_id', $user->id)
            ->where('model_type', get_class($knowledgeBase))
            ->whereNull('parent_id')
            ->orderBy('id', 'desc')
            ->paginate(25);

        $dataPage = $query->toArray();
        $paginator = new LengthAwarePaginator(
            $query->reverse(),
            $dataPage['total'],
            $dataPage['per_page'],
            $dataPage['current_page'],
            $dataPage
        );

        return ChatGPTResource::collection($paginator);
    }

    public function message(Request $request)
    {
        $request->validate([
            'message'   => 'required|string|max:2000',
            'chatModel' => 'nullable|in:' . implode(',', ChatGPTService::MODEL),
        ]);

        $user = User::getAuth();
        $knowledgeBase = new KnowledgeBase();

        // Use the standard chatGPT() helper — sets model_type/model_id correctly
        $chatGPT = $knowledgeBase->chatGPT();
        $chatGPT->chat_model = $request->chatModel ?? ChatGPTService::MODEL[0];
        $chatGPT->message    = $request->message;
        $chatGPT->client_id  = $user->id; // set BEFORE save so creatingEvent skips admin_id
        $chatGPT->save();

        // Build prompt
        $chat = new ChatGPTService($chatGPT);
        $chat->setModel($chatGPT->chat_model);

        $prompt  = 'В поле [текст] описан вопрос пользователя. ';
        $prompt .= 'Определи язык [текст] и ответь строго на том же языке. ';
        $prompt .= 'Ты — AI-ассистент платформы Infiniti (console.infiniti.stream). ';
        $prompt .= 'Тема дискуссии: ' . $knowledgeBase->discussionTopic();

        $block = [];
        $block[$knowledgeBase->discussionName()] = $knowledgeBase->modelDescription();
        $block['текст'] = $request->message;

        $chat->write($prompt);
        foreach ($block as $name => $value) {
            $chat->write("[{$name}]\n{$value}\n");
        }

        $responseModel = $chat->send()->toModel();
        if ($responseModel) {
            $responseModel->client_id = $user->id;
            $responseModel->save();
        }

        $chatGPT->log_message = $chat->getHistory(2);
        $chatGPT->save();

        return response()->json([
            'status' => true,
            'data'   => new ChatGPTResource($responseModel ?? $chatGPT),
        ]);
    }
}
