<?php


namespace App\Models\Contracts;


use App\Services\ChatGPT;

interface ChatGPTContract
{
    public function discussion(ChatGPT $chat);
    public function modelDescription();
    public function discussionColumn();
}
