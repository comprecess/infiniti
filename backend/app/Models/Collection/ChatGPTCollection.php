<?php

namespace App\Models\Collection;

use Illuminate\Database\Eloquent\Collection;

class ChatGPTCollection extends Collection
{
    public function toChat($name = "ChatGPT")
    {
        $text = collect();
        $this->each(function ($item) use($text, $name){
            $text->push(($item->parent_id ? $name : $item->admin->fullname) . " : " . $item->message);
        });

        return $text->implode("\n");
    }
}
