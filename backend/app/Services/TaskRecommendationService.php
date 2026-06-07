<?php

namespace App\Services;

use App\Models\Catalog\User as CatalogUser;
use App\Models\Resident\Project\Project;
use Illuminate\Support\Collection;

class TaskRecommendationService
{
    /**
     * Keyword-to-specialization mapping for confidence scoring.
     * Each entry maps task keywords to the specialization that best matches.
     */
    protected array $keywordMap = [
        // Financial / Valuation
        'valuation' => ['Business Analysis', 'Investor Relations'],
        'financial' => ['Business Analysis', 'Investor Relations'],
        'budget' => ['Business Analysis'],
        'forecast' => ['Business Analysis'],
        'revenue' => ['Business Analysis'],
        'metrics' => ['Business Analysis'],
        'kpi' => ['Business Analysis'],

        // Growth / Marketing
        'growth' => ['Social Media Marketing', 'Business Development'],
        'marketing' => ['Social Media Marketing'],
        'social' => ['Social Media Marketing'],
        'brand' => ['Social Media Marketing'],
        'campaign' => ['Social Media Marketing'],
        'content' => ['Social Media Marketing'],
        'seo' => ['Social Media Marketing'],

        // Investor / Fundraising
        'investor' => ['Investor Relations', 'Investor relations'],
        'pitch' => ['Investor Relations'],
        'fundrais' => ['Investor Relations'],
        'deck' => ['Investor Relations'],
        'due diligence' => ['Investor Relations', 'Business Analysis'],
        'term sheet' => ['Investor Relations'],

        // Product / Roadmap
        'roadmap' => ['Product Management', 'Product management'],
        'product' => ['Product Management', 'Product management'],
        'feature' => ['Product Management'],
        'backlog' => ['Product Management'],
        'sprint' => ['Product Management'],
        'user story' => ['Product Management'],
        'requirement' => ['Product Management'],

        // Technical / Architecture
        'architecture' => ['CTO & Product Architect', 'System architecture'],
        'technical' => ['CTO & Product Architect'],
        'infrastructure' => ['CTO & Product Architect'],
        'api' => ['CTO & Product Architect'],
        'database' => ['CTO & Product Architect'],
        'security' => ['CTO & Product Architect'],
        'deployment' => ['CTO & Product Architect'],
        'code' => ['CTO & Product Architect'],

        // Business Development
        'partnership' => ['Business Development'],
        'sales' => ['Business Development'],
        'lead' => ['Business Development'],
        'outreach' => ['Business Development'],
        'client' => ['Business Development'],
        'deal' => ['Business Development'],
    ];

    /**
     * Recommend AI workers for a task based on title/description.
     *
     * @param Project $project
     * @param string $taskTitle
     * @param string|null $taskDescription
     * @return array Array of recommendations sorted by confidence desc
     */
    public function recommend(Project $project, string $taskTitle, ?string $taskDescription = null): array
    {
        $aiTeam = $this->getAiTeamWithSpecializations($project);

        if ($aiTeam->isEmpty()) {
            return [];
        }

        $searchText = strtolower($taskTitle . ' ' . ($taskDescription ?? ''));
        $scores = [];

        foreach ($aiTeam as $worker) {
            $score = $this->calculateConfidence($searchText, $worker);
            if ($score > 0) {
                $scores[] = [
                    'id' => $worker->id,
                    'name' => $worker->name,
                    'specialization' => $worker->specialization,
                    'hourly_rate' => $worker->hourly_rate,
                    'confidence_score' => min($score, 99), // Cap at 99%
                ];
            }
        }

        // Sort by confidence descending
        usort($scores, fn($a, $b) => $b['confidence_score'] <=> $a['confidence_score']);

        // Return top 3 recommendations
        return array_slice($scores, 0, 3);
    }

    /**
     * Calculate confidence score for a worker against the task text.
     */
    protected function calculateConfidence(string $searchText, CatalogUser $worker): int
    {
        $score = 0;
        $matchCount = 0;

        foreach ($this->keywordMap as $keyword => $specializations) {
            if (str_contains($searchText, $keyword)) {
                if (in_array(strtolower($worker->specialization), array_map("strtolower", $specializations))) {
                    $score += 30; // Direct specialization match
                    $matchCount++;
                }
            }
        }

        // Check worker skills against task text
        if (!empty($worker->skills)) {
            foreach ($worker->skills as $skill) {
                $skillLower = strtolower($skill);
                if (str_contains($searchText, $skillLower) || str_contains($skillLower, $searchText)) {
                    $score += 15;
                    $matchCount++;
                }
            }
        }

        // Normalize: base confidence starts at 50% for any match, scales up
        if ($matchCount > 0) {
            $score = min(50 + ($matchCount * 15), 99);
        }

        return $score;
    }

    /**
     * Get AI team members with their specializations and skills loaded.
     */
    protected function getAiTeamWithSpecializations(Project $project): Collection
    {
        $catalogUsers = $project->teams;

        return $catalogUsers->map(function (CatalogUser $user) {
            $props = $user->getPropsByNameId(['priceHour']);
            $user->hourly_rate = 0;
            foreach ($props as $prop) {
                if ($prop->id_name === 'priceHour') {
                    $user->hourly_rate = (float) ($prop->values->first()?->value ?? 0);
                }
            }

            // Load specialization from values
            $values = $user->values()->with('prop')->get();
            $specialization = $values->first(function ($v) {
                return $v->prop && $v->prop->id_name === 'specialization';
            });
            $user->specialization = $specialization?->value ?? '';

            // Load skills
            $skills = $values->filter(function ($v) {
                return $v->prop && in_array($v->prop->id_name, ['key_skills', 'all_skills']);
            })->pluck('value')->toArray();
            $user->skills = $skills;

            return $user;
        });
    }
}
