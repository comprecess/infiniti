<?php

namespace App\Listeners\Client\BusinessPlan;

use App\Events\Client\BusinessPlan\Generate;
use App\Models\Resident\BusinessPlan;
use App\Models\Resident\Question;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;

class Answers implements  ShouldQueue
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
        $event->businessPlan->status_generate = BusinessPlan::STATUS_GENERATE[1];
        $event->businessPlan->save();

        $original = Arr::get($event->businessPlan->answer, 'original', []);
        $chatGptAnswer = [];

        if($original){
            $questionList = Question::whereIn('id', array_keys($original))->get();
            foreach($original as $id => $value){
                $question = $questionList->where('id', $id)->first();
                $chatGptAnswer[__($question->key_lang.".text")] = $question->getValue($value);
            }
        }

        $event->businessPlan->answer = ['original' => $original, 'values' => $chatGptAnswer];
        $event->businessPlan->save();

//        for($i = 0; $i < 20; $i++) {
//            sleep(1);
//        }
//
//        Log::alert('***Answers*** complete');
    }
}
