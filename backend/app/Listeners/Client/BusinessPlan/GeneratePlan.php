<?php

namespace App\Listeners\Client\BusinessPlan;

use App\Events\Client\BusinessPlan\Generate;
use App\Models\Resident\BusinessPlan;
use App\Services\ChatGPT as ChatGPTService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;

class GeneratePlan implements ShouldQueue
{
    public $timeout = 300;

    public function __construct() {}

    public function handle(Generate $event): void
    {
        $plan = $event->businessPlan;

        try {
            // 1. Format Q&A from answers
            $qaText = $this->formatQuestionAnswer(Arr::get($plan->answer, 'chatGptValue'));

            if (!$qaText) {
                Log::error('GeneratePlan: no chatGptValue answers found for plan #' . $plan->id);
                $plan->status_generate = BusinessPlan::STATUS_GENERATE[3];
                $plan->save();
                return;
            }

            // 2. Get business model description
            $plan->load(['businessModel', 'businessModel.values', 'businessModel.props', 'businessModel.values.prop']);
            $businessModelText = $plan->modelDescription();

            // 3. Build prompt
            $prompt = $this->buildPrompt($qaText, $businessModelText);

            // 4. Send to OpenAI
            $chat = new ChatGPTService();
            $chat->setSystemPrompt(
                "You are a senior venture partner with 15+ years of experience at top-tier VC firms and venture studios. " .
                "You have reviewed thousands of pitch decks and written business plans that raised $500M+ in funding. " .
                "You write with authority, precision, and commercial acumen. " .
                "Every sentence must earn its place — no filler, no vague claims. " .
                "You always back statements with numbers, market logic, and competitive insight. " .
                "Your business plans make investors lean forward, not lean back."
            );
            $chat->write($prompt);
            $chat->send();

            $response = $chat->getHistory();

            if (!$response) {
                Log::error('GeneratePlan: empty OpenAI response for plan #' . $plan->id);
                $plan->status_generate = BusinessPlan::STATUS_GENERATE[3];
                $plan->save();
                return;
            }

            // 5. Parse tagged sections from response
            $sections = $this->parseTaggedSections($response);

            // 6. Save sections to business plan fields
            if (!empty($sections['Executive Summary']))      $plan->ex_summary  = $sections['Executive Summary'];
            if (!empty($sections['Company Description']))    $plan->description = $sections['Company Description'];
            if (!empty($sections['Market Analysis']))        $plan->m_analysis  = $sections['Market Analysis'];
            if (!empty($sections['Organization & Management'])) $plan->management = $sections['Organization & Management'];
            if (!empty($sections['Investment/Funding Request'])) $plan->investment = $sections['Investment/Funding Request'];
            if (!empty($sections['Financial Projections']))  $plan->finance     = $sections['Financial Projections'];

            $plan->status_generate = BusinessPlan::STATUS_GENERATE[2]; // Ready
            $plan->save();

            Log::info('GeneratePlan: successfully generated plan #' . $plan->id);

        } catch (\Exception $e) {
            Log::error('GeneratePlan exception for plan #' . $plan->id . ': ' . $e->getMessage());
            $plan->status_generate = BusinessPlan::STATUS_GENERATE[3]; // Error
            $plan->save();
        }
    }

    private function formatQuestionAnswer(?array $chatGptValue): ?string
    {
        if (empty($chatGptValue)) {
            return null;
        }

        $text = "";
        foreach ($chatGptValue as $blockData) {
            $title = Arr::get($blockData, 'title', '');
            $items = Arr::get($blockData, 'items', []);

            if ($title) {
                $text .= "\n## {$title}\n";
            }

            foreach ($items as $item) {
                $question = Arr::get($item, 'question', '');
                $value    = Arr::get($item, 'value', '');

                if (is_array($value)) {
                    $value = implode(', ', array_filter($value));
                }

                if ($question && $value) {
                    $text .= "Q: {$question}\nA: {$value}\n\n";
                }
            }
        }

        return trim($text) ?: null;
    }

    private function buildPrompt(string $qaText, string $businessModelText): string
    {
        return <<<PROMPT
You are a senior partner at a top-tier venture studio writing a professional business plan that will be reviewed by VCs, angel investors, and strategic partners. The plan must be compelling, credible, and investor-ready.

FOUNDER INPUTS:
{$qaText}

BUSINESS MODEL DATA:
{$businessModelText}

REQUIREMENTS FOR EACH SECTION:
- Write in confident, precise English — the tone of a seasoned founder who knows their market
- Use specific numbers, market data estimates, and concrete milestones (derive reasonable market size figures from the niche if not provided)
- Each section: 3-5 paragraphs with rich HTML formatting: <p>, <ul>, <li>, <strong>, <h3> tags
- Avoid generic filler phrases like "we aim to" or "we hope to" — use declarative statements
- Make investors feel the opportunity is urgent and the team is execution-ready

SECTION INSTRUCTIONS:

Executive Summary: Hook the reader in the first sentence with the problem scale and market opportunity. State the solution, traction goal, revenue model, target market size, and the one key insight that makes this defensible. End with a clear ask or next step.

Company Description: Describe the company's mission, the exact pain being solved, why now is the right moment (macro tailwinds), and what makes the product uniquely positioned. Include the product's core mechanics and why users will love it.

Market Analysis: Include TAM/SAM/SOM estimates with reasoning. Describe customer segments with specificity (job title, company size, behavior). Analyze 2-3 competitors and articulate the white space. Describe the market dynamics driving urgency (regulation, digital transformation, inefficiency cost).

Organization & Management: Describe the founding team's relevant expertise and what unfair advantages they bring. List key hires needed and why. Describe the operational model, key partners, and how the team will execute in the first 90 days.

Investment/Funding Request: State clearly the current funding status and what the startup can achieve with existing resources. If raising — state the amount, use of funds broken down by category (product 40%, sales 35%, ops 25%), and what milestones will be hit. Include a compelling reason why now is the right time to invest.

Financial Projections: Provide a 12-month projection table in HTML with columns: Month, Customers, MRR, ARR, Key Milestone. Show the path from 0 to product-market fit. Include unit economics: CAC, LTV, LTV/CAC ratio, payback period. End with Year 1, Year 2, Year 3 revenue targets.

CTA Section — CRITICAL: End the Financial Projections section with a strong CTA block styled as:
<div class="cta-block">
<h3>Ready to accelerate this venture?</h3>
<p>This business plan was generated on the <strong>INFINITI Venture OS</strong> — the platform that turns business models into investor-ready companies in days, not months.</p>
<ul>
<li>🚀 Access 50+ vetted specialists to build your team</li>
<li>📊 Get AI-powered market research and financial modeling</li>
<li>🤝 Connect with INFINITI's investor network</li>
<li>⚡ Launch your pilot in 90 days</li>
</ul>
<p><strong>Join INFINITI →</strong> <a href="https://console.infiniti.stream">console.infiniti.stream</a></p>
</div>

Respond ONLY in this exact pattern with no text outside the tags:

{Executive Summary}HTML content{/Executive Summary}
{Company Description}HTML content{/Company Description}
{Market Analysis}HTML content{/Market Analysis}
{Organization & Management}HTML content{/Organization & Management}
{Investment/Funding Request}HTML content{/Investment/Funding Request}
{Financial Projections}HTML content including CTA block at the end{/Financial Projections}
PROMPT;
    }

    private function parseTaggedSections(string $response): array
    {
        $sections = [];
        $tags = [
            'Executive Summary',
            'Company Description',
            'Market Analysis',
            'Organization & Management',
            'Investment/Funding Request',
            'Financial Projections',
        ];

        foreach ($tags as $tag) {
            $start = mb_strpos($response, "{{$tag}}");
            $end   = mb_strpos($response, "{/{$tag}}");

            if ($start !== false && $end !== false) {
                $offset = $start + mb_strlen("{{$tag}}");
                $sections[$tag] = trim(mb_substr($response, $offset, $end - $offset));
            }
        }

        return $sections;
    }
}
