<?php

namespace App\Listeners\Client\BusinessPlan;

use App\Events\Client\BusinessPlan\Generate;
use App\Models\Resident\BusinessPlan;
use App\Services\ChatGPT as ChatGPTService;
use App\Socket\Client as ClientSocket;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;

class GeneratePlan implements ShouldQueue
{
    public $timeout = 600;

    public function __construct() {}

    public function handle(Generate $event): void
    {
        $plan = $event->businessPlan;

        try {
            // 1. Format Q&A from answers
            $this->sendProgress($plan, 5);
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
            $this->sendProgress($plan, 10);

            // 3. Web research — use gpt-4o-search-preview to gather real market data
            $this->sendProgress($plan, 15, 'Researching live market data...');
            $marketResearch = $this->gatherMarketResearch($qaText, $businessModelText);
            $this->sendProgress($plan, 40, 'Market research complete. Writing your plan...');

            // 4. Build prompt with research data injected
            $prompt = $this->buildPrompt($qaText, $businessModelText, $marketResearch);
            $this->sendProgress($plan, 45, 'Generating investor-grade business plan...');

            // 5. Send to OpenAI gpt-4o for final plan generation
            $chat = new ChatGPTService();
            $chat->setSystemPrompt(
                "You are a senior venture partner with 15+ years of experience at top-tier VC firms and venture studios. " .
                "You have reviewed thousands of pitch decks and written business plans that raised \$500M+ in funding. " .
                "You write with authority, precision, and commercial acumen. " .
                "Every sentence must earn its place — no filler, no vague claims. " .
                "You always back statements with numbers, market logic, and competitive insight. " .
                "Your business plans make investors lean forward, not lean back."
            );
            $chat->write($prompt);
            $chat->send();
            $this->sendProgress($plan, 85, 'Plan generated. Saving sections...');

            $response = $chat->getHistory();

            if (!$response) {
                Log::error('GeneratePlan: empty OpenAI response for plan #' . $plan->id);
                $plan->status_generate = BusinessPlan::STATUS_GENERATE[3];
                $plan->save();
                return;
            }

            // 6. Parse tagged sections from response
            $sections = $this->parseTaggedSections($response);

            // 7. Save sections to business plan fields
            if (!empty($sections['Executive Summary']))          $plan->ex_summary  = $sections['Executive Summary'];
            if (!empty($sections['Company Description']))        $plan->description = $sections['Company Description'];
            if (!empty($sections['Market Analysis']))            $plan->m_analysis  = $sections['Market Analysis'];
            if (!empty($sections['Organization & Management']))  $plan->management  = $sections['Organization & Management'];
            if (!empty($sections['Products & Services']))        $plan->product     = $sections['Products & Services'];
            if (!empty($sections['Marketing & Sales Strategy'])) $plan->marketing   = $sections['Marketing & Sales Strategy'];
            if (!empty($sections['Implementation Timeline']))    $plan->budget      = $sections['Implementation Timeline'];
            if (!empty($sections['Funding Requirements']))       $plan->investment  = $sections['Funding Requirements'];
            if (!empty($sections['Financial Projections']))      $plan->finance     = $sections['Financial Projections'];
            if (!empty($sections['Risk Analysis']))              $plan->appendix    = $sections['Risk Analysis'];

            $plan->status_generate = BusinessPlan::STATUS_GENERATE[2]; // Ready
            $plan->save();
            $this->sendProgress($plan, 100, 'Done!');

            Log::info('GeneratePlan: successfully generated plan #' . $plan->id);

        } catch (\Exception $e) {
            Log::error('GeneratePlan exception for plan #' . $plan->id . ': ' . $e->getMessage());
            $plan->status_generate = BusinessPlan::STATUS_GENERATE[3]; // Error
            $plan->save();
        }
    }

    /**
     * Step 1: Use gpt-4o-search-preview to gather real-time market data
     * before passing it into the main plan generation prompt.
     */
    private function gatherMarketResearch(string $qaText, string $businessModelText): string
    {
        try {
            $researchChat = new ChatGPTService();
            $researchChat->setModel('gpt-4o-search-preview');
            $researchChat->setSystemPrompt(
                "You are a market research analyst. Your job is to find current, accurate market data " .
                "from reliable sources. Always cite sources and dates. Be concise and factual."
            );

            $researchPrompt = <<<PROMPT
Based on the following founder inputs and business model, search the web and gather current market research data.

FOUNDER INPUTS:
{$qaText}

BUSINESS MODEL:
{$businessModelText}

Search for and provide:
1. Current market size (TAM) for this industry/niche — include the figure, source, and year
2. Market growth rate (CAGR) for the next 3-5 years — source and year
3. Top 3-5 competitors in this space — their names, approximate revenue/funding, and key differentiators
4. 2-3 key market trends driving growth right now
5. Any relevant regulatory or macro factors affecting this market

Format your response as structured text with clear headings. Be specific with numbers and cite sources where possible.
PROMPT;

            $researchChat->write($researchPrompt);
            $researchChat->send();

            $result = $researchChat->getHistory();

            if ($result) {
                Log::info('GeneratePlan: market research gathered successfully for plan context');
                return $result;
            }
        } catch (\Exception $e) {
            Log::warning('GeneratePlan: market research step failed, continuing without it: ' . $e->getMessage());
        }

        return ''; // Non-blocking — continue without research if it fails
    }

    /**
     * Send progress update to the client via WebSocket.
     * Emits 'business-plan-progress' event with planId + percent + label.
     */
    private function sendProgress(BusinessPlan $plan, int $percent, string $label = ''): void
    {
        try {
            if ($user = $plan->client) {
                (new ClientSocket())
                    ->setUser($user)
                    ->setController('business-plan-progress')
                    ->setData([
                        'planId'  => $plan->id,
                        'percent' => $percent,
                        'label'   => $label,
                    ])
                    ->sendData();
            }
        } catch (\Throwable $e) {
            // Non-blocking — progress failure must NEVER stop plan generation
            Log::warning('GeneratePlan: sendProgress failed (non-fatal): ' . $e->getMessage());
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

    private function buildPrompt(string $qaText, string $businessModelText, string $marketResearch = ''): string
    {
        $researchSection = $marketResearch
            ? "LIVE MARKET RESEARCH (sourced from the web — use these real figures in your plan):\n{$marketResearch}\n"
            : "MARKET RESEARCH: Not available — derive reasonable estimates from the industry context.\n";

        return <<<PROMPT
You are a senior partner at a top-tier venture studio writing a professional, investor-grade business plan. The reader is a sophisticated VC, angel investor, or strategic partner. Be precise, data-driven, and commercially sharp. No filler. Every sentence must earn its place.

FOUNDER INPUTS:
{$qaText}

BUSINESS MODEL DATA:
{$businessModelText}

{$researchSection}
GLOBAL WRITING RULES:
- LANGUAGE: The ENTIRE plan MUST be written in English regardless of the language of the inputs above
- Confident, declarative English — the voice of an execution-ready founder
- Back every claim with numbers (derive reasonable market figures if not provided)
- Rich HTML: use <p>, <ul>, <li>, <strong>, <h3>, <table>, <tr>, <th>, <td> where appropriate
- No phrases like "we aim to", "we hope to", "we believe" — state facts and targets
- 3–5 paragraphs per section minimum

SECTION INSTRUCTIONS:

Executive Summary:
Open with the problem size and market urgency in one punchy sentence. Then: the solution and what makes it defensible, the target customer, the revenue model, key traction metrics or targets, and a crisp funding ask / next step. Include a <ul> of 4–5 Key Success Factors. End with Financial Highlights: Funding Required, Projected Year 1 Revenue, Break-Even Timeline.

Company Description:
Business structure (legal form, location, founding context). Mission statement — one sentence on why this company exists. The exact pain being solved and why existing solutions fail. Why NOW is the right moment (macro tailwinds, regulatory shift, technology inflection). Core product/service mechanics. List of 4–5 Competitive Advantages as <ul>.

Market Analysis:
Industry overview: current size, growth rate (CAGR), key trends driving expansion. TAM/SAM/SOM with clear reasoning. Primary customer segment: job title, company size, behavior, demographics, psychographics, and pain points. Secondary segments if applicable. Competitive Analysis: HTML table comparing 3 competitors (Competitor | Strengths | Weaknesses | Est. Market Share). Market Positioning paragraph: how this company occupies unique white space.

Organization & Management:
Org chart description (key roles and reporting). Management team: for each key person — Name, Title, relevant background, unfair advantage they bring. Advisory Board (if any). Key hires needed in next 12 months and why. Operational model and key external partners.

Products & Services:
Detailed description of each product/service. Core value proposition for each. Pricing model and tiers. Technology or IP that creates defensibility. Product roadmap highlights: what ships in Q1, Q2, Q3–Q4. Why customers will choose this over alternatives.

Marketing & Sales Strategy:
Brand positioning statement. Marketing channels with budget allocation reasoning (Social Media, Content/SEO, Paid Acquisition, Partnerships, PR). Sales process: Lead Generation → Qualification → Presentation → Close. Monthly Sales Targets for months 1–12 as HTML table (Month | Target Customers | MRR Target | Key Activity). Pricing strategy with justification for each tier.

Implementation Timeline:
Quarterly milestones for Year 1 as an HTML table (Quarter | Key Milestones | Success Metrics). Q1 = Foundation, Q2 = Launch, Q3 = Scale, Q4 = Optimize. Be specific: product releases, customer targets, hiring, partnerships, revenue gates.

Funding Requirements:
Total funding needed. Use of funds as <ul> with percentages (Product Development, Sales & Marketing, Operations, Working Capital, Reserve). What milestones will be achieved with this capital. Current funding status. Why now is the optimal time to invest. ROI scenario for investor.

Financial Projections:
12-month projection HTML table: Month | New Customers | Total Customers | MRR | ARR | Key Milestone. Unit economics block: CAC, LTV, LTV/CAC ratio, Payback Period. Startup costs breakdown as <ul>. 3-year revenue targets: Year 1, Year 2, Year 3 Revenue + Net Profit. Break-even analysis: Fixed Costs, Variable Costs per unit, Avg Sale Price, Units to Break Even.

Risk Analysis:
HTML table of 5–7 key risks: Risk | Impact (High/Med/Low) | Probability (High/Med/Low) | Mitigation Strategy. Cover: market risk, competitive risk, execution risk, regulatory risk, funding risk. After the table, a short paragraph on overall risk posture and why this team is positioned to navigate these risks.

IMPORTANT — DO NOT include any CTA block. The CTA will be added separately by the platform.

Respond ONLY in this exact format — no text outside the tags, no preamble, no comments:

{Executive Summary}HTML content{/Executive Summary}
{Company Description}HTML content{/Company Description}
{Market Analysis}HTML content{/Market Analysis}
{Organization & Management}HTML content{/Organization & Management}
{Products & Services}HTML content{/Products & Services}
{Marketing & Sales Strategy}HTML content{/Marketing & Sales Strategy}
{Implementation Timeline}HTML content{/Implementation Timeline}
{Funding Requirements}HTML content{/Funding Requirements}
{Financial Projections}HTML content{/Financial Projections}
{Risk Analysis}HTML content{/Risk Analysis}
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
            'Products & Services',
            'Marketing & Sales Strategy',
            'Implementation Timeline',
            'Funding Requirements',
            'Financial Projections',
            'Risk Analysis',
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
