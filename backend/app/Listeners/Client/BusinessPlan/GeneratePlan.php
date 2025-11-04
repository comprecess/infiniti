<?php

namespace App\Listeners\Client\BusinessPlan;

use App\Events\Client\BusinessPlan\Generate;
use App\Models\Resident\BusinessPlan;
use App\Services\ChatGPT as ChatGPTService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;

class GeneratePlan implements ShouldQueue
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(Generate $event): void
    {

        $answer = $event->businessPlan->answer;
        $valuesChatGpt = $this->formatQuestionAnswer(Arr::get($answer, 'values'));
        $chat = new ChatGPTService();
        $questionAbswer = null;

        if(!$valuesChatGpt) {
            $event->businessPlan->status_generate = BusinessPlan::STATUS_GENERATE[3];
            $event->businessPlan->save();
            return;
        }


        $promt = "Составь бизнес план из бизнес модели, бизнес план должен соответсвовать ответам и вопросам из поля [questions]. Бизнес модель находится в поле [businessModel]. Распиши бизнес план по следующим полям: Executive Summary, Company description, Market Analysis, Organization & Management, Investment/Funding request, Financial projections. Твой ответ должен быть в виде паттерна [pattern]. \n\n
            [pattern]\n
            {Executive Summary}Твой ответ в виде HTML разметки{/Executive Summary}\n
            {Company description}Твой ответ в виде HTML разметки{/Company description}\n
            {Market Analysis}Твой ответ в виде HTML разметки{/Market Analysis}\n
            {Organization & Management}Твой ответ в виде HTML разметки{/Organization & Management}\n
            {Investment/Funding request}Твой ответ в виде HTML разметки{/Investment/Funding request}\n
            {Financial projections}Твой ответ в виде HTML разметки{/Financial projections}\n
            ";

        $chat->write($promt);

        $value = $event->businessPlan->modelDescription();
        $chat->write("[businessModel]\n{$value}\n");








        Log::alert('***GeneratePlan*** complete');
    }

    private function formatQuestionAnswer($questionAnswer = null)
    {
        $value = "";
        if(!$questionAnswer) {
            return null;
        }

        foreach($questionAnswer as $id => $value){

        }
    }
}
