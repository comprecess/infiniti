<?php
namespace App\Services;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use OpenAI\Laravel\Facades\OpenAI;
class ChatGPT
{
    const MODEL = [
        'gpt-4o',
        'gpt-4.5',
        'gpt-4o-mini',
        'gpt-4o-search-preview',
        'gpt-4o-mini-search-preview',
        'o1',
        'o1-mini',
        'o3-mini',
    ];

    const SEARCH_MODELS = [
        'gpt-4o-search-preview',
        'gpt-4o-mini-search-preview',
    ];

    private $model = null;
    private $chatGPTModel = null;
    private $write = [];
    private $history = [];
    private $conversationHistory = [];
    private $lastMessage = null;
    private $error = null;
    private $systemPrompt = null;

    public function __construct(?\App\Models\ChatGPT $chatGPTModel = null)
    {
        $this->model = self::MODEL[0];
        $this->chatGPTModel = $chatGPTModel;
        $this->systemPrompt = $this->getDefaultSystemPrompt();
    }

    public function setModel($model)
    {
        if(in_array($model, self::MODEL)) {
            $this->model = $model;
        }
        return $this;
    }

    public function setSystemPrompt($prompt)
    {
        $this->systemPrompt = $prompt;
        return $this;
    }

    public function addConversationMessage($role, $content)
    {
        $this->conversationHistory[] = ['role' => $role, 'content' => $content];
        return $this;
    }

    public function write($prompt, $ln = true)
    {
        if($ln) {
            $this->write[] = $prompt;
        } else {
            $this->write[count($this->write) - 1 < 0 ? 0 : count($this->write) - 1]  = $prompt;
        }
        return $this;
    }

    public function writeClear()
    {
        $this->write = [];
        return $this;
    }

    public function send($prompt = null, $model = null)
    {
        if(!$prompt && $this->write) {
            $prompt = implode("\n", $this->write);
        }
        $this->history[] = $prompt;

        try {
            $messages = $this->buildMessages($prompt);
            $params = [
                'model' => $model ?? $this->model,
                'messages' => $messages,
            ];

            // Enable web search for search-capable models
            if(in_array($params['model'], self::SEARCH_MODELS)) {
                $params['web_search_options'] = [
                    'search_context_size' => 'medium',
                ];
            }

            $this->lastMessage = OpenAI::chat()->create($params)->toArray();
            $this->history[] = Arr::get($this->lastMessage, 'choices.0.message.content');
        }catch (\Exception $e) {
            Log::error($e->getMessage(), $e->getTrace());
            $this->error = $e->getMessage();
        }
        return $this;
    }

    /**
     * Build the messages array with system prompt + conversation history + current message
     */
    private function buildMessages($currentPrompt): array
    {
        $messages = [];

        // Add system prompt (not for o1/o3 models which don't support system role)
        if($this->systemPrompt && !$this->isReasoningModel()) {
            $messages[] = ['role' => 'system', 'content' => $this->systemPrompt];
        }

        // Add conversation history (previous messages from DB)
        foreach($this->conversationHistory as $msg) {
            $messages[] = $msg;
        }

        // Add current user message
        $messages[] = ['role' => 'user', 'content' => $currentPrompt];

        return $messages;
    }

    /**
     * Check if current model is a reasoning model (o1, o3) that doesn't support system role
     */
    private function isReasoningModel(): bool
    {
        return in_array($this->model, ['o1', 'o1-mini', 'o3-mini']);
    }

    /**
     * Get the default system prompt with INFINITI knowledge base
     */
    private function getDefaultSystemPrompt(): string
    {
        $knowledgeBase = $this->getKnowledgeBase();

        return <<<PROMPT
Ты — AI-ассистент платформы INFINITI (console.infiniti.stream). Ты помогаешь резидентам и команде INFINITI в их работе над стартапами и венчурными проектами.

## Твоя роль:
- Ты глубоко разбираешься в бизнесе, стартапах, венчурном строительстве, финансовом моделировании, маркетинге и технологиях
- Ты помогаешь резидентам двигаться к их целям: от идеи до запуска и масштабирования
- Ты отвечаешь на языке, на котором написан вопрос
- Ты даёшь конкретные, практичные ответы без воды
- Если не знаешь точного ответа — честно говоришь об этом и предлагаешь пути решения

## О платформе INFINITI:
{$knowledgeBase}

## Правила:
1. Отвечай на том же языке, на котором задан вопрос
2. Будь конкретным и практичным — давай actionable советы
3. Если вопрос касается проекта резидента — помогай глубоко, предлагай следующие шаги
4. Если вопрос выходит за рамки твоих знаний — предложи связаться с командой INFINITI
5. Используй данные из базы знаний INFINITI когда это релевантно
6. Не придумывай факты — если не уверен, скажи об этом
PROMPT;
    }

    /**
     * Get the knowledge base content about INFINITI
     */
    private function getKnowledgeBase(): string
    {
        // Try to load from file first (allows dynamic updates)
        $knowledgePath = storage_path('app/ai/knowledge_base.txt');
        if(file_exists($knowledgePath)) {
            return file_get_contents($knowledgePath);
        }

        // Fallback to built-in knowledge
        return <<<KB
INFINITI — это AI-powered венчурная студия с проприетарной Venture Operating System (VOS).

### Что делает INFINITI:
- Автоматизирует 80% процесса запуска стартапа
- Обеспечивает запуск в 10 раз быстрее и в 5 раз дешевле традиционных подходов
- Фокус: Россия/СНГ/CEE регион, рынок $50B+ с ростом 15-20% в год

### Бизнес-модель (3 уровня):
- Tier 1: DIY ($499/мес) — доступ к платформе, AI-инструменты для бизнес-планирования, исследования рынка, формирования команды
- Tier 2: Concierge ($5K-20K/мес) — платформа + персональная поддержка от 50+ специалистов
- Tier 3: Studio (20-40% equity) — полный капитал, платформа и hands-on поддержка

### Функции Venture OS:
- AI Business Plan Generator — создаёт investor-ready бизнес-планы за 24 часа
- Team Builder & Talent Marketplace — доступ к сети 50+ проверенных специалистов
- Market Research Engine — анализ размера рынка, трендов, конкурентов
- Financial Modeling Suite — автоматические прогнозы, unit economics, сценарное планирование
- Investor CRM & Deal Flow — управление отношениями с инвесторами, 11,000+ контактов
- Legal Document Generator — автоматические term sheets, SHA, корпоративные документы

### 7-этапная методология:
1. Research — анализ рынка, трендов, конкурентов
2. Ideate — кристаллизация идеи, тестирование гипотез
3. Model — дизайн бизнес-модели (250+ валидированных моделей в библиотеке)
4. Build — сборка команды, разработка MVP за 90 дней
5. Launch — стратегический запуск, первые клиенты, product-market fit
6. Finance — финансовое планирование, доступ к инвесторам
7. Scale — масштабирование через расширение команды и рынков

### Секторная стратегия:
- B2B SaaS (40%) — включая AI-powered SaaS
- FinTech (30%) — высокий рост, высокая доходность
- AI-Powered EdTech (15%) — будущее образования
- LegalTech (10%) — недооценённый рынок
- General AI/ML (5%) — широкая AI-волна

### Команда:
- Founder/CEO — серийный предприниматель
- CTO — full-stack инженерия, AI/ML, архитектура платформы
- Head of Investments — инвестиционный банкинг, структурирование сделок
- AI/Prompt Engineer — AI-системы, автоматизация
- 50+ специалистов в сети (инженерия, дизайн, маркетинг, финансы, юриспруденция)

### Финансовые цели:
- Year 1 (2026): 12 продуктов, $2.5M выручка, 30 клиентов, 25 человек в команде
- Year 2 (2027): 25 продуктов, $8.5M выручка, 80 клиентов, 60 человек
- Year 3 (2028): 40 продуктов, $22M выручка, 200 клиентов, 120 человек

### Контакты:
- Email: contact@infiniti.stream
- Платформа: console.infiniti.stream
- Сайт: infiniti.stream
KB;
    }

    public function getAnswer()
    {
        return $this->lastMessage;
    }

    public function getHistory($last = 1)
    {
        return $this->history[count($this->history) - $last] ?? null;
    }

    public function toModel(?\App\Models\ChatGPT $chatGPTModel = null) :?\App\Models\ChatGPT
    {
        $model = $this->chatGPTModel ?? $chatGPTModel;
        if(!$model) {
            return null;
        }
        if($this->lastMessage) {
            $message =  $this->getHistory();
            $log_message = null;
        } else {
            $message =  __('chat_gpt.message.error');
            $log_message = $this->error;
        }
        $analysis = Arr::get($model->data, 'analysis', []);
        if(!$log_message && count($analysis)) {
            $log_message = $message;
            $message = trim(preg_replace('/\{\/?([^\}]*)\}/', '', $message));
        }
        $chat = $model->replicate();
        $chat->id = null;
        $chat->parent_id = $model->id;
        $chat->chat_id = Arr::get($this->lastMessage, 'id', 'no_id_or_error');
        $chat->message = $message;
        $chat->log_message = $log_message;
        return $chat;
    }

    public function getTagInfo()
    {
        $message = $this->getHistory();
        preg_match_all('/\{\/?([^\}]*)\}/', $message, $preg);
        $result = [];
        if(count($preg)) {
            $uniqPreg = array_unique($preg[1]);
            foreach($uniqPreg as $tag) {
                $startSearch = "{{$tag}}";
                $endSearch = "{/{$tag}}";
                $start = mb_strpos($message, $startSearch);
                $end = mb_strpos($message, $endSearch);
                if($start !== null && $end !== null){
                    $calc = $start + strlen($startSearch);
                    $result[$tag] = trim(mb_substr($message, $calc, $end - $calc));
                }
            }
        }
        return $result;
    }
}
