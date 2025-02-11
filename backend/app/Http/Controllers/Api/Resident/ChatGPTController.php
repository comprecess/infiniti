<?php


namespace App\Http\Controllers\Api\Resident;


use App\Http\Requests\Resident\ChatGPTRequest;
use App\Http\Resources\Resident\ChatGPTResource;
use App\Models\ChatGPT;
use App\Services\ChatGPT as ChatGPTService;
use App\Models\User;
use Illuminate\Http\Request;

class ChatGPTController extends ResidentController
{
    public function historyUser(ChatGPTRequest $request)
    {
        $user = User::getAuth();

        $query = ChatGPT::where('admin_id', $user->id)
            ->whereNotNull('admin_id')
            ->findModel($request->discussionModel, $request->discussionId)
            ->orderBy('id', 'desc')
            ->limit(25);

        return ChatGPTResource::collection($query->get());
    }

    public function message(ChatGPTRequest $request)
    {
        $chat = $request
            ->getChatGPT()
            ->discussionAboutModel();

        return new ChatGPTResource($chat);
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
}
