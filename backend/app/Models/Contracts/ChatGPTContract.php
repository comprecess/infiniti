<?php


namespace App\Models\Contracts;



interface ChatGPTContract
{
    public function discussionTopic() :string;
    public function modelDescription(mixed $data = null);
    public function discussionName() :string;
    public function getResourceChat();
}
