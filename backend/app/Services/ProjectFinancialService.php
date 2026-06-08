<?php

namespace App\Services;

use App\Models\Catalog\User as CatalogUser;
use App\Models\Resident\Project\Project;
use App\Models\Resident\Project\TaskTime;
use Illuminate\Support\Collection;

class ProjectFinancialService
{
    /**
     * Default equivalent human senior consultant rate ($/hr).
     */
    const EQUIVALENT_HUMAN_RATE = 200;

    /**
     * Calculate all financial metrics for a project's AI workforce.
     *
     * @param Project $project
     * @return array{planned_ai_cost: float, actual_ai_cost: float, equivalent_human_cost: float, saved_budget: float, ai_hours: float, breakdown: array}
     */
    public function calculate(Project $project): array
    {
        $aiTeam = $this->getAiTeamWithRates($project);
        $timeEntries = $this->getAiTimeEntries($project, $aiTeam->pluck('id'));
        $plannedHours = $this->getPlannedHours($project, $aiTeam->pluck('id'));

        $actualAiCost = 0;
        $totalAiHours = 0;
        $breakdown = [];

        foreach ($aiTeam as $worker) {
            $workerEntries = $timeEntries->where('user_id', $worker->id);
            $workerHours = $this->sumTimeEntries($workerEntries);
            $workerCost = $workerHours * $worker->hourly_rate;
            $workerPlannedHours = $plannedHours->get($worker->id, 0);
            $workerPlannedCost = $workerPlannedHours * $worker->hourly_rate;

            $actualAiCost += $workerCost;
            $totalAiHours += $workerHours;

            $breakdown[] = [
                'id' => $worker->id,
                'name' => $worker->name,
                'hourly_rate' => $worker->hourly_rate,
                'planned_hours' => $workerPlannedHours,
                'planned_cost' => $workerPlannedCost,
                'actual_hours' => $workerHours,
                'actual_cost' => $workerCost,
            ];
        }

        $plannedAiCost = collect($breakdown)->sum('planned_cost');
        $equivalentHumanCost = $totalAiHours * self::EQUIVALENT_HUMAN_RATE;
        $savedBudget = $equivalentHumanCost - $actualAiCost;

        return [
            'planned_ai_cost' => round($plannedAiCost, 2),
            'actual_ai_cost' => round($actualAiCost, 2),
            'equivalent_human_cost' => round($equivalentHumanCost, 2),
            'saved_budget' => round($savedBudget, 2),
            'ai_hours' => round($totalAiHours, 2),
            'breakdown' => $breakdown,
        ];
    }

    /**
     * Parse HH:MM time format to decimal hours.
     * Handles formats: "HH:MM", "H:MM", or plain numeric values.
     */
    protected function parseTimeToHours(string $time): float
    {
        if (str_contains($time, ':')) {
            $parts = explode(':', $time);
            $hours = (int) $parts[0];
            $minutes = (int) ($parts[1] ?? 0);
            return $hours + ($minutes / 60);
        }
        return (float) $time;
    }

    /**
     * Sum time entries converting HH:MM format to decimal hours.
     */
    protected function sumTimeEntries(Collection $entries): float
    {
        $total = 0;
        foreach ($entries as $entry) {
            $total += $this->parseTimeToHours($entry->time);
        }
        return round($total, 2);
    }

    /**
     * Get AI team members for a project with their hourly rates.
     */
    protected function getAiTeamWithRates(Project $project): Collection
    {
        $catalogUsers = $project->teams;

        return $catalogUsers->map(function (CatalogUser $user) {
            $props = $user->getPropsByNameId(['priceHour', 'priceDay']);
            $hourly = 0;
            $daily = 0;
            foreach ($props as $prop) {
                $val = $prop->values->first()?->value ?? 0;
                if ($prop->id_name === 'priceHour') {
                    $hourly = (float) $val;
                } elseif ($prop->id_name === 'priceDay') {
                    $daily = (float) $val;
                }
            }
            $user->hourly_rate = $hourly;
            $user->daily_rate = $daily;
            return $user;
        });
    }

    /**
     * Get all time entries logged by AI workers on this project.
     */
    protected function getAiTimeEntries(Project $project, Collection $aiUserIds): Collection
    {
        return TaskTime::where('project_id', $project->id)
            ->where('user_type', CatalogUser::class)
            ->whereIn('user_id', $aiUserIds)
            ->get();
    }

    /**
     * Get planned hours from tasks assigned to AI workers.
     * Uses task time_spent field as planned allocation (format: HH:MM).
     * Returns a collection keyed by user_id => total planned hours.
     */
    protected function getPlannedHours(Project $project, Collection $aiUserIds): Collection
    {
        $result = collect();
        foreach ($aiUserIds as $userId) {
            // For now, planned hours default to 0 until task estimates are implemented
            $result->put($userId, 0);
        }
        return $result;
    }
}
