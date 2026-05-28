<?php
    return [
        'businessModel' => [
            'title' => [
               'parse' => ['заголовок', 'title', 'заголов'],
            ],
            'description' => [
                'parse' => ['описание', 'brief description', 'краткое описание', 'описани', 'кратк', 'descript']
            ],
            'full_description' => [
                'parse' => ['подробное описание', 'full description', 'полное описание', 'подробное описание']
            ],
            'industries' => [
                'table' => 'props',
                'parse' => ['отрасли промышленности', 'industries', 'отрасли', 'промышленности', 'industry', 'отрасл', 'промышленнос'],
            ],
            'technologies' => [
                'table' => 'props',
                'parse' => ['технологии', 'technologies', 'technology', 'технолог'],
            ],
            'location' => [
                'table' => 'props',
                'parse' => ['расположение', 'location', 'расположен', 'локаци', 'position'],
            ],
            'category' => [
                'table' => 'props',
                'parse' => ['категория', 'category', 'категори', 'categor'],
            ],
            'market_analysis' => [
                'parse' => ['анализ рынка', 'market analysis', 'analysis', 'market', 'анализ', 'рын'],
                'html' => true,
            ],
            'financial_model' => [
                'parse' => ['финансоваю модель', 'financial model', 'финансовая модель', 'финанс', 'финансовый', 'financial'],
                'html' => true,
            ],
            'current_investors' => [
                'parse' => ['текущие инвесторы', 'current investors', 'текущие инвесторы', 'инвесто', 'invest', 'current'],
                'html' => true,
            ],
            'stages_implementation' => [
                'parse' => ['этапы внедрения', 'implementation stages', 'внедрени', 'этап', 'stage', 'implement'],
                'html' => true,
            ],
            'partnership_options' => [
                'parse' => ['варианты партнерства', 'partnership options', 'вариант', 'партнер', 'partner', 'option'],
                'html' => true,
            ],
            // ── Passport & Economics (новые поля) ────────────────────────
            'target_client' => [
                'parse' => ['целевой клиент', 'target client', 'jobs to be done', 'jtbd', 'клиент', 'client', 'target'],
                'html' => true,
            ],
            'value_proposition' => [
                'parse' => ['ценностное предложение', 'value proposition', 'конкурентный ров', 'moat', 'value prop', 'ценность', 'предложение'],
                'html' => true,
            ],
            'revenue_logic' => [
                'parse' => ['логика монетизации', 'revenue logic', 'монетизация', 'revenue streams', 'revenue', 'монетиза', 'доход'],
                'html' => true,
            ],
            'unit_economics' => [
                'parse' => ['юнит-экономика', 'unit economics', 'unit econ', 'юнит', 'unit', 'экономика', 'arpa', 'cac', 'ltv'],
                'html' => true,
            ],
            'facts_hypotheses_risks' => [
                'parse' => ['факты гипотезы риски', 'facts hypotheses risks', 'риски', 'гипотезы', 'facts', 'risks', 'hypotheses', 'риск', 'гипотез'],
                'html' => true,
            ],
        ],
        'businessPlan' => [
            'description' => [
                'parse' => ['описание', 'company description', 'описани', 'descript'],
                'html' => true,
            ],
            'ex_summary' => [
                'parse' => ['управляющее резюме', 'executive summary', 'резюме', 'summary'],
                'html' => true,
            ],
            'm_analysis' => [
                'parse' => ['анализ рынка', 'market analysis', 'анализы рынка', 'рынок', 'market', 'analys'],
                'html' => true,
            ],
            'management' => [
                'parse' => ['организация и управление', 'organization & management', 'управление', 'organization', 'management'],
                'html' => true,
            ],
            'product' => [
                'parse' => ['услуга или продукт', 'service or product', 'услуг', 'продукт', 'service', 'product'],
                'html' => true,
            ],
            'marketing' => [
                'parse' => ['маркетинг и продажи', 'marketing and sales', 'маркетинг', 'marketing'],
                'html' => true,
            ],
            'budget' => [
                'parse' => ['бюджет', 'budget'],
                'html' => true,
            ],
            'investment' => [
                'parse' => ['запрос на инвестиции/финансирование', 'investment/funding request', 'инвестиции', 'финансирование', 'финансовый', 'investment', 'funding'],
                'html' => true,
            ],
            'finance' => [
                'parse' => ['финансовые прогнозы', 'financial projections', 'финансовы', 'прогноз', 'financial', 'projection'],
                'html' => true,
            ],
            'appendix' => [
                'parse' => ['приложение', 'appendix', 'приложени'],
                'html' => true,
            ],
        ],

    ];
