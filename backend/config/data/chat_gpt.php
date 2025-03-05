<?php
    return [
        'businessModel' => [
            'title' => [
               'parse' => ['заголовок', 'title', 'заголов']
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
            ],
            'financial_model' => [
                'parse' => ['финансоваю модель', 'financial model', 'финансовая модель', 'финанс', 'финансовый', 'financial'],
            ],
            'current_investors' => [
                'parse' => ['текущие инвесторы', 'current investors', 'текущие инвесторы', 'инвесто', 'invest', 'current'],
            ],
            'stages_implementation' => [
                'parse' => ['этапы внедрения', 'implementation stages', 'внедрени', 'этап', 'stage', 'implement'],
            ],
            'partnership_options' => [
                'parse' => ['варианты партнерства', 'partnership options', 'вариант', 'партнер', 'partner', 'option'],
            ]
        ]

    ];
