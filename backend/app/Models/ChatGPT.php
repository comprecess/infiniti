<?php

namespace App\Models;

use App\Models\Traits\UserTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OpenAI\Laravel\Facades\OpenAI;

class ChatGPT extends Model
{
    use HasFactory, UserTrait;

    const TYPE = ['in', 'out'];

    protected $table = 'chat_gpt';

    protected $adminColumn = 'admin_id';

    public static function test($promt = null) {
        $result = OpenAI::chat()->create([
            'model' => 'gpt-4o',
            'messages' => [
                ['role' => 'user', 'content' => 'Hello!'],
            ],
        ]);

        dd($result);
    }

}
