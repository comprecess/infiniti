<?php
    return [
        'businessModel' => [
            'title' => [
               'parse' => ['заголовок', 'заголов', 'title']
            ],
            'description' => [
                'parse' => ['описание', 'brief description', 'краткое описание', 'описани', 'кратк', 'descript']
            ],
            'full_description' => [
                'parse' => ['подробное описание', 'full description', 'полное описание', 'полн', 'подробн', 'описани', 'full', 'descript']
            ],
            'industries' => [
                'table' => 'props',
                'parse' => ['отрасли промышленности', 'отрасли', 'промышленности', 'industry', 'отрасл', 'промышленнос'],
            ],
            'technologies' => [
                'table' => 'props',
                'parse' => ['технологии', 'technology', 'технолог'],
            ],
            'location' => [
                'table' => 'props',
                'parse' => ['расположение', 'расположен', 'локаци', 'position', 'location'],
            ],
            'category' => [
                'table' => 'props',
                'parse' => ['категория', 'категори', 'categor'],
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
