<?php


namespace App\Models\Traits;


use App\Models\ChatGPT;

trait ChatGPTTrait
{
    public function chatGPT() :ChatGPT
    {
        $chatGPT = new ChatGPT();
        $chatGPT->setDiscussionModel($this);
        return $chatGPT;
    }
}
