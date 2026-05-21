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
                "You are an expert business plan writer at INFINITI venture studio. " .
                "You create detailed, investor-ready business plans in English. " .
                "Be specific, use real numbers and concrete details from the provided answers. " .
                "Format your response strictly according to the pattern provided."
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
Create a comprehensive, investor-ready business plan based on the business model and the founder's answers below.

[questions]
{$qaText}

[businessModel]
{$businessModelText}

Write the business plan in English. Be specific — use facts, numbers, and details from the answers above.
Each section should be 2-4 paragraphs of substantive content in HTML format (use <p>, <ul>, <li>, <strong> tags).

Respond strictly in this pattern:

{Executive Summary}Your HTML content here{/Executive Summary}
{Company Description}Your HTML content here{/Company Description}
{Market Analysis}Your HTML content here{/Market Analysis}
{Organization & Management}Your HTML content here{/Organization & Management}
{Investment/Funding Request}Your HTML content here{/Investment/Funding Request}
{Financial Projections}Your HTML content here{/Financial Projections}
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
