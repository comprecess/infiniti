<?php

namespace App\Services\ChatGPT\Prompts;


use App\Http\Resources\Resident\Talents\TalentChatGPTResource;
use App\Models\Catalog\User;
use App\Services\ChatGPT;
use Illuminate\Support\Arr;

class BusinessPlan
{

    public function selectionSpecialists($model)
    {

//        $businessModel = $model->discussionModel?->businessModel;
//        if($businessModel instanceof \App\Models\BusinessModel\BusinessModel) {
//            $model->setDiscussionModel($businessModel);
//            $redyPrompt = new BusinessModel();
//            return $redyPrompt->selectionSpecialists($model);
//        }
        $chat = new ChatGPT($model);

        $data = config('data.chat_gpt.businessPlan');

        $users = User::active()
            ->with(['values', 'values.prop'])
            ->get();

        $lang = __('prompt.lang');


        $resorce = TalentChatGPTResource::toChatCollection($users);
        $chat->write("Подбери комманду специалистов из списка сотрудников [список сотрудников] для этой бизнес-плана [бизнес-план], специалисты не должны повторятся по свойствам если только бизнес-план слишком большой в реализации. Используй паттерн [паттерн], в теге ids напиши те id которые ты выбрал, а в description опиши {$lang} почему именно эти сотрудники подходят для этой бизнес-плана [бизнес-плана]")
            ->write("[список сотрудников]\n" . $resorce)
            ->write("[бизнес-план]\n" . $model->discussionModel->modelDescription($data))
            ->write("[паттерн]\n" . "{ids}id сотрудников через запятую{/ids}\n{description}формате html{/description}");

        return $chat;
    }

    public function autoInput($model)
    {
        $data = config('data.chat_gpt.businessPlan');

        $field = Arr::get($data, pascalCaseToSnakeCase($model->message));

        if(!$field) {
            return null;
        }

        $chat = new ChatGPT($model);


        $lang = __('prompt.lang');

        $nameField = Arr::get($field, 'parse.0');
        $html = Arr::get($field, 'html', false) ? " в формате html" : "";

        $chat->write("Напиши {$lang}{$html} про \"{$nameField}\" этой бизнес-плана [бизнес-план]. Не пиши в началае ничего лишнего, начинай сразу по существу и в завершении не пиши выводов - оставь только суть этого блока. Используй паттерн [паттерн]")
            ->write("[бизнес-план]\n" . $model->discussionModel->modelDescription($data))
            ->write("[паттерн]\n" . "{{$model->message}}{$nameField}{/{$model->message}}");


        return $chat;
    }

}
