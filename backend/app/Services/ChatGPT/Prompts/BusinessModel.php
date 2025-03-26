<?php


namespace App\Services\ChatGPT\Prompts;


use App\Http\Resources\Resident\Talents\TalentChatGPTResource;
use App\Models\Catalog\User;
use App\Services\ChatGPT;

class BusinessModel
{

    public function selectionSpecialists($model)
    {
        $chat = new ChatGPT($model);

        $data = config('data.chat_gpt.businessModel');

        $users = User::active()
            ->with(['values', 'values.prop'])
            ->get();

        $lang = __('prompt.lang');

        $resorce = TalentChatGPTResource::toChatCollection($users);
        $chat->write("Подбери комманду специалистов из списка сотрудников [список сотрудников] для этой бизнес-модели [бизнес-модель], специалисты не должны повторятся по свойствам если только бизнес-модель слишком большая в реализации. Используй паттерн [паттерн], в теге ids напиши те id которые ты выбрал, а в description опиши {$lang}, почему именно эти сотрудники подходят для этой бизнес-модели [бизнес-модель]")
        ->write("[список сотрудников]\n" . $resorce)
        ->write("[бизнес-модель]\n" . $model->discussionModel->modelDescription($data))
        ->write("[паттерн]\n" . "{ids}id сотрудников через запятую{/ids}\n{description}формате html{/description}");


        return $chat;
    }

}
