<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BusinessModel\BusinessModelResource;
use App\Models\BusinessModel\BusinessModel;
use App\Services\ChatGPT as ChatGPTService;
use Illuminate\Http\Request;


class TestController extends Controller
{

    public function getData()
    {
        $sablonQuestion = "🧩 Контекст и Цель
        Вопрос: В какой нише или отрасли ты хочешь применить бизнес-модель?
        Ответ:
        Вопрос: Какая цель для тебя важнее всего сейчас?
        Ответ: [🚀 Запустить пилот], [💵 Найти первых клиентов], [📈 Привлечь инвестиции], [🌍 Выйти на новый рынок]

        👤 Клиент и Ценность
        Вопрос: Кто твой идеальный клиент?
        Ответ: [B2B / B2C], [Должность/роль], [Сегмент]
        Вопрос: Какую основную проблему этого клиента ты решаешь?
        Ответ:
        Вопрос: Как они решают её сейчас?
        Ответ:

        💰 Модель дохода
        Вопрос: Как ты планируешь зарабатывать?
        Ответ: [Подписка (SaaS)], [Комиссия/процент], [Разовая лицензия], [Транзакции / оборот]
        Вопрос: Какой средний чек или LTV клиента в твоей нише?
        Ответ:
        Вопрос: Какие барьеры или риски ты видишь на рынке?
        Ответ:

        🚀 Маркетинг и Продажи
        Вопрос: Где проще всего найти твоих клиентов?
        Ответ: [LinkedIn], [Telegram], [Выставки], [Офлайн-каналы]
        Вопрос: Что для тебя приоритетно на старте?
        Ответ: [10 платящих клиентов быстро], [Масштаб через инвестиции]
        Вопрос: Какой канал продаж кажется тебе самым рабочим?
        Ответ:

        🛠️ Продукт и Команда
        Вопрос: На какой стадии продукт?
        Ответ: [Только идея], [MVP], [Есть пилот], [Уже есть продажи]
        Вопрос: Каких специалистов не хватает в команде?
        Ответ:
        Вопрос: Готов ли ты подключить внешних экспертов через INFINITI?
        Ответ: [Аутстафф], [Консалтинг]

        📈 Финансы и Инвестиции
        Вопрос: Какой у тебя бюджет на старт?
        Ответ:
        Вопрос: Нужны ли инвестиции?
        Ответ: [Да], [Нет]
            Вопрос: Сколько?
            Ответ:
            Вопрос: На какой срок?
            Ответ:
        Вопрос: Какие KPI готов показать через 6 месяцев?
        Ответ:

        🗺️ География и Масштабирование
        Вопрос: В какой стране/регионе планируешь запуститься первым?
        Ответ:
        Вопрос: Какие рынки видишь следующими?
        Ответ:
        Вопрос: Есть ли у тебя локальные партнёры или план их поиска?
        Ответ:

        📋 Личное и Осознанное
        Вопрос: Почему именно ты должен реализовать этот проект?
        Ответ: [Твоя экспертиза], [Опыт], [Мотивация]
        Вопрос: Какой горизонт планирования для тебя комфортен?
        Ответ: [6 мес.], [1 год], [3 года]
        Вопрос: Что для тебя будет означать успех?
        Ответ:
        ";

        return response()->json([
            'businessModel' =>  BusinessModelResource::collection(BusinessModel::all()),
            'model' => ChatGPTService::MODEL,
            'questionAndAnswer' => $sablonQuestion,
            'promt' => "Составь бизнес план из бизнес модели, бизнес план должен соответсвовать ответам и вопросам из поля [questions]. Бизнес модель находится в поле [businessModel]. Распиши бизнес план по следующим полям: Executive Summary, Company description, Market Analysis, Organization & Management, Investment/Funding request, Financial projections. Твой ответ должен быть в виде паттерна [pattern]. \n\n
            [pattern]\n
            {Executive Summary}Твой ответ в виде HTML разметки{/Executive Summary}\n
            {Company description}Твой ответ в виде HTML разметки{/Company description}\n
            {Market Analysis}Твой ответ в виде HTML разметки{/Market Analysis}\n
            {Organization & Management}Твой ответ в виде HTML разметки{/Organization & Management}\n
            {Investment/Funding request}Твой ответ в виде HTML разметки{/Investment/Funding request}\n
            {Financial projections}Твой ответ в виде HTML разметки{/Financial projections}\n
            "
        ]);
    }

    public function queryPromt(Request $request)
    {
        $chat = new ChatGPTService();

        if ($request->model) {
            $chat->setModel($request->model);
        }

        if (!$request->promt) {
            return response()->json(['message' => "Промт обязательне поле"]);
        }
        $chat->write($request->promt);

        if ($request->businessModel) {
            $model = BusinessModel::findorFail($request->businessModel);
            $value = $model->modelDescription();
            $chat->write("[businessModel]\n{$value}\n");
        }

        if ($request->questionAndAnswer) {
            $chat->write("[questions]\n{$request->questionAndAnswer}\n");
        }

        return response()->json(['message' => $chat->send()->getHistory()]);

    }
}
