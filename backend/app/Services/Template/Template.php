<?php
namespace App\Services\Template;

class Template
{
    public function render(string $text)
    {
        preg_match_all('/(\{\{([a-z0-9_-]*)\}\})/', $text, $matches);
        dd($matches);
    }
}
