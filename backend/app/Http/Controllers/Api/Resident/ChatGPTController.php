<?php


namespace App\Http\Controllers\Api\Resident;


use App\Http\Requests\Resident\ChatGPTRequest;
use App\Http\Resources\Resident\ChatGPTResource;
use App\Models\ChatGPT;
use App\Services\ChatGPT as ChatGPTService;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

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
