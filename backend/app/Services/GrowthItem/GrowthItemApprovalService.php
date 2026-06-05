<?php

namespace App\Services\GrowthItem;

use App\Models\Resident\Project\Project;
use App\Models\Resident\Project\Task;
use App\Models\Resident\Project\GrowthItem\ProjectGrowthItem;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class GrowthItemApprovalService
{
    /**
     * Approve a growth item and optionally create linked Task and Offer.
     *
     * @param ProjectGrowthItem $item
     * @param array $options ['create_task' => bool, 'create_offer' => bool, 'assign_to' => int|null]
     * @return ProjectGrowthItem
     */
    public function approveAndExecute(ProjectGrowthItem $item, array $options = []): ProjectGrowthItem
    {
        return DB::transaction(function () use ($item, $options) {
            // 1. Approve the item
            $item->approve();

            // 2. Create a linked Task in the project Kanban
            if ($options['create_task'] ?? true) {
                $task = $this->createLinkedTask($item, $options['assign_to'] ?? null);
                $item->sys_task_id = $task->id;
                $item->status = ProjectGrowthItem::STATUS_IN_PROGRESS;
                $item->save();
            }

            // 3. Create a linked Offer if estimated_cost > 0
            // (Offer creation is deferred to the Deal Manager's manual action
            //  to avoid auto-generating financial documents without explicit approval.
            //  The controller provides a separate endpoint for this.)

            return $item->fresh(['task', 'offer', 'invoice']);
        });
    }

    /**
     * Create a Kanban task linked to the growth item.
     */
    protected function createLinkedTask(ProjectGrowthItem $item, ?int $assignTo = null): Task
    {
        $project = $item->project;
        $user = User::getAuth();

        $task = new Task();
        $task->title = "[Growth] {$item->title}";
        $task->description = $this->buildTaskDescription($item);
        $task->status = Task::STATUS[1]; // 'In Progress'
        $task->pid = $project->id;
        $task->aid = $assignTo ?? $user->id;
        $task->priority = 'High';
        $task->started = now();
        $task->due_date = now()->addDays($item->estimated_duration_days);
        $task->source = 'growth_item';
        $task->rel_type = ProjectGrowthItem::class;
        $task->rel_id = $item->id;
        $task->save();

        return $task;
    }

    /**
     * Build a rich description for the task from the growth item data.
     */
    protected function buildTaskDescription(ProjectGrowthItem $item): string
    {
        $parts = [];
        $parts[] = $item->description ?? '';
        $parts[] = '';
        $parts[] = '--- Growth Item Details ---';
        $parts[] = "Category: {$item->category}";
        $parts[] = "Estimated Cost: \${$item->estimated_cost}";
        $parts[] = "Estimated Duration: {$item->estimated_duration_days} days";
        $parts[] = "Confidence: {$item->confidence_percent}%";

        if ($item->impact_multiplier_increase > 0) {
            $parts[] = "Expected Multiplier Impact: +{$item->impact_multiplier_increase}x";
        }
        if ($item->impact_metric_increase > 0) {
            $parts[] = "Expected Metric Impact: +\${$item->impact_metric_increase}";
        }

        return implode("\n", $parts);
    }

    /**
     * Handle task completion — update growth item status and trigger recalculation.
     * This can be called from a Task observer or event listener.
     */
    public function onTaskCompleted(Task $task): void
    {
        if ($task->rel_type !== ProjectGrowthItem::class || !$task->rel_id) {
            return;
        }

        $growthItem = ProjectGrowthItem::find($task->rel_id);
        if ($growthItem && $growthItem->status === ProjectGrowthItem::STATUS_IN_PROGRESS) {
            $growthItem->complete();
        }
    }
}
