<?php
return [
    'block' => [
        1 => "🧩 Context & Goal",
        2 => "👤 Customer & Value",
        3 => "💰 Revenue Model",
        4 => "🚀 Marketing & Sales",
        5 => "🛠️ Product & Team",
        6 => "📈 Finance & Investment",
        7 => "🗺️ Geography",
    ],
    'question' => [
        1 => [
            1 => ['text' => 'What niche or industry do you want to apply this business model to?', 'type' => 'string'],
            2 => ['text' => 'What is your most important goal right now?', 'type' => 'radiobox'],
        ],
        2 => [
            1 => ['text' => 'Who is your ideal customer, and what core problem do you solve for them?', 'type' => 'radiobox'],
            2 => ['text' => 'How do they currently solve this problem?', 'type' => 'string'],
        ],
        3 => [
            1 => ['text' => 'How do you plan to make money?', 'type' => 'radiobox'],
            2 => ['text' => 'What is the average deal size or customer LTV in your niche?', 'type' => 'string'],
            3 => ['text' => 'What barriers or risks do you see in the market?', 'type' => 'string'],
        ],
        4 => [
            1 => ['text' => 'Where is the easiest place to find your customers?', 'type' => 'radiobox'],
            2 => ['text' => 'What is your top priority at launch?', 'type' => 'radiobox'],
        ],
        5 => [
            1 => ['text' => 'What stage is your product at?', 'type' => 'radiobox'],
            2 => ['text' => 'What specialists are missing from your team?', 'type' => 'string'],
        ],
        6 => [
            1 => ['text' => 'What is your startup budget, and do you need investment?', 'type' => 'string'],
            2 => ['text' => 'What KPIs can you show in 6 months?', 'type' => 'string'],
        ],
        7 => [
            1 => ['text' => 'Which country or region will you launch in first?', 'type' => 'string'],
            2 => ['text' => 'Which markets do you see as next?', 'type' => 'string'],
        ],
        6001 => [
            1 => ['text' => 'How much investment do you need?', 'type' => 'string', 'parentValue' => true],
            2 => ['text' => 'For what period?', 'type' => 'string', 'parentValue' => true],
        ],
    ],
    'answer' => [
        1 => [
            2 => [
                1 => ['text' => "🚀 Launch a pilot", 'type' => 'radiobox'],
                2 => ['text' => "💵 Find first paying customers", 'type' => 'radiobox'],
                3 => ['text' => "📈 Attract investment", 'type' => 'radiobox'],
                4 => ['text' => "🌍 Enter a new market", 'type' => 'radiobox'],
            ]
        ],
        2 => [
            1 => [
                1 => ['text' => "B2B", 'type' => 'radiobox'],
                2 => ['text' => "B2C", 'type' => 'radiobox'],
                3 => ['text' => "B2B2C", 'type' => 'radiobox'],
            ],
        ],
        3 => [
            1 => [
                1 => ['text' => "Subscription (SaaS)", 'type' => 'radiobox'],
                2 => ['text' => "Commission / revenue share", 'type' => 'radiobox'],
                3 => ['text' => "One-time license", 'type' => 'radiobox'],
                4 => ['text' => "Transactions / volume", 'type' => 'radiobox'],
            ],
        ],
        4 => [
            1 => [
                1 => ['text' => "LinkedIn", 'type' => 'radiobox'],
                2 => ['text' => "Telegram / WhatsApp", 'type' => 'radiobox'],
                3 => ['text' => "Conferences & events", 'type' => 'radiobox'],
                4 => ['text' => "Offline channels", 'type' => 'radiobox'],
            ],
            2 => [
                1 => ['text' => "10 paying customers fast", 'type' => 'radiobox'],
                2 => ['text' => "Scale through investment", 'type' => 'radiobox'],
            ],
        ],
        5 => [
            1 => [
                1 => ['text' => "Just an idea", 'type' => 'radiobox'],
                2 => ['text' => "MVP", 'type' => 'radiobox'],
                3 => ['text' => "Pilot running", 'type' => 'radiobox'],
                4 => ['text' => "Already generating sales", 'type' => 'radiobox'],
            ],
        ],
        8 => [
            1 => [
                1 => ['text' => "Your expertise", 'type' => 'radiobox'],
                2 => ['text' => "Experience", 'type' => 'radiobox'],
                3 => ['text' => "Motivation", 'type' => 'radiobox'],
            ],
            2 => [
                1 => ['text' => "6 months", 'type' => 'radiobox'],
                2 => ['text' => "1 year", 'type' => 'radiobox'],
                3 => ['text' => "3 years", 'type' => 'radiobox'],
            ],
        ],
    ],
    'finish' => [
        'title' => '🏁 All done!',
        'body' => "<p>Thank you for your answers! 🙌</p><br>

<p>Based on them, we will generate:</p><br>
<ul>
<li>📄 A personalised business plan tailored to your niche,</li>
<li>🗺️ A step-by-step roadmap,</li>
<li>👥 Team and expert recommendations via INFINITI.</li>
</ul>"
    ]
];
