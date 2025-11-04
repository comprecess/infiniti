<?php

namespace App\Listeners\Client\BusinessPlan;

use App\Events\Client\BusinessPlan\Generate;
use App\Models\Resident\BusinessPlan;
use App\Models\Resident\Question;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;

class Answers /*implements ShouldQueue*/
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
            Question::whereIn('id', array_keys($original))
                ->orderBy('id')
                ->with(['children', 'parent'])
                ->each(function ($item) use($original, &$chatGptAnswer){
                    $itemData = [
                        'question' => __($item->key_lang.".text"),
                        'value' => $item->getValue(Arr::get($original, $item->id)),
                    ];

                    if(isset($chatGptAnswer[$item->parent->id])) {
                        $chatGptAnswer[$item->parent->id]['items'][] = $itemData;
                    }else{
                        $chatGptAnswer[$item->parent->id] = [
                            'title' => __($item->parent->key_lang),
                            'items' => [$itemData]
                        ];
                    }
//                    $chatGptAnswer[$item->parent->id][] = [
//                       'question' => __($item->key_lang.".text"),
//                       'value' => $item->getValue(Arr::get($original, $item->id)),
//                    ];
                });
//            $questionList = Question::whereIn('id', array_keys($original))->orderBy('id')->get();
//            foreach($original as $id => $value){
//                $question = $questionList->where('id', $id)->first();
//                $chatGptAnswer[__($question->key_lang.".text")] = $question->getValue($value);
//            }
        }

        $event->businessPlan->answer = ['original' => $original, 'chatGptValue' => $chatGptAnswer];
        $event->businessPlan->save();

//        for($i = 0; $i < 20; $i++) {
//            sleep(1);
//        }
//
//        Log::alert('***Answers*** complete');
    }
}
