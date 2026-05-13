<?php

namespace App\Models;

use App\Http\Resources\Resident\KnowledgeBaseChatGPTResource;
use App\Models\Contracts\ChatGPTContract;
use App\Models\Traits\ChatGPTTrait;
use Illuminate\Database\Eloquent\Model;

class KnowledgeBase extends Model implements ChatGPTContract
{
    use ChatGPTTrait;

    protected $table = 'knowledge_base';

    public function discussionTopic(): string
    {
        return 'платформа Infiniti (console.infiniti.stream) — CRM/ERP-система для резидентов. ' .
            'Платформа включает: управление лидами и клиентами, проекты, задачи, счета, ' .
            'бизнес-планы и бизнес-модели, таланты (специалисты), заказы, SMS-рассылки, ' .
            'поддержку (тикеты), документы, HRM, закупки, поставщиков, отчёты, календарь. ' .
            'Отвечай только по теме работы платформы Infiniti. ' .
            'Если вопрос не связан с платформой — вежливо перенаправь пользователя к теме платформы.';
    }

    public function discussionName(): string
    {
        return 'Knowledge Base Infiniti';
    }

    public function modelDescription(mixed $data = null): string
    {
        return 'Ты — помощник платформы Infiniti (console.infiniti.stream). ' .
            'Помогай резидентам разобраться с функциями платформы: ' .
            'лиды, клиенты, проекты, задачи, счета, бизнес-планы, таланты, заказы, ' .
            'поддержка, документы, HRM, закупки, поставщики, отчёты, календарь, SMS. ' .
            'Давай чёткие, практические ответы на русском или английском языке в зависимости от языка вопроса.';
    }

    public function getResourceChat(): string
    {
        return KnowledgeBaseChatGPTResource::class;
    }
}
