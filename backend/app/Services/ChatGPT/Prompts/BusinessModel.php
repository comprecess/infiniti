<?php


namespace App\Services\ChatGPT\Prompts;


use App\Http\Resources\Resident\Talents\TalentChatGPTResource;
use App\Models\Catalog\User;
use App\Services\ChatGPT;
use Illuminate\Support\Arr;

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

        $resource = TalentChatGPTResource::toChatCollection($users);
        $chat->write("Подбери команду специалистов из списка сотрудников [список сотрудников] для этой бизнес-модели [бизнес-модель], специалисты не должны повторятся по свойствам если только бизнес-модель слишком большая в реализации. Используй паттерн [паттерн], в теге ids напиши те id которые ты выбрал, а в description опиши {$lang} почему именно эти сотрудники подходят для этой бизнес-модели [бизнес-модель]")
        ->write("[список сотрудников]\n" . $resource)
        ->write("[бизнес-модель]\n" . $model->discussionModel->modelDescription($data))
        ->write("[паттерн]\n" . "{ids}id сотрудников через запятую{/ids}\n{description}формате html{/description}");


        return $chat;
    }

    public function autoInput($model)
    {
        $data = config('data.chat_gpt.businessModel');

        $field = Arr::get($data, pascalCaseToSnakeCase($model->message));

        if(!$field) {
            return null;
        }

        $chat = new ChatGPT($model);


        $lang = __('prompt.lang');

        $nameField = Arr::get($field, 'parse.0');
        $html = Arr::get($field, 'html', false) ? " в формате html" : "";

        $chat->write("Напиши {$lang}{$html} про \"{$nameField}\" этой бизнес-модели [бизнес-модель]. Не пиши в началае ничего лишнего, начинай сразу по существу и в завершении не пиши выводов - оставь только суть этого блока. Используй паттерн [паттерн]")
            ->write("[бизнес-модель]\n" . $model->discussionModel->modelDescription($data))
            ->write("[паттерн]\n" . "{{$model->message}}{$nameField}{/{$model->message}}");


        return $chat;
    }

}
