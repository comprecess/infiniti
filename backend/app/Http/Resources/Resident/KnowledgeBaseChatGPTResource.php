<?php

namespace App\Http\Resources\Resident;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class KnowledgeBaseChatGPTResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [];
    }

    public function toChat(mixed $data = null): string
    {
        return 'Ты — AI-помощник платформы Infiniti (console.infiniti.stream). ' .
            'Платформа является CRM/ERP-системой для резидентов. ' .
            'Помогай пользователям разобраться с разделами: ' .
            'Лиды, Клиенты, Проекты, Задачи, Счета, Предложения, ' .
            'Бизнес-планы, Бизнес-модели, Таланты, Заказы, ' .
            'SMS-рассылки, Поддержка (тикеты), База знаний, ' .
            'Документы, HRM, Закупки, Поставщики, Отчёты, Календарь. ' .
            'Отвечай чётко и по существу. Определяй язык вопроса и отвечай на том же языке.';
    }
}
