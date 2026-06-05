<?php

namespace App\Http\Controllers\Api\Resident\Project\GrowthItem;

use App\Http\Controllers\Controller;
use App\Models\Resident\Project\Project;
use App\Models\Resident\Project\GrowthItem\ProjectGrowthItem;
use App\Services\GrowthItem\GrowthItemApprovalService;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GrowthItemController extends Controller
{
    /**
     * List all growth items for a project.
     */
    public function index(Request $request, int $projectId): JsonResponse
    {
        $project = Project::findOrFail($projectId);

        $query = ProjectGrowthItem::forProject($projectId)
            ->with(['task', 'offer', 'invoice']);

        if ($request->has('status')) {
            $query->byStatus($request->input('status'));
        }

        if ($request->has('category')) {
            $query->byCategory($request->input('category'));
        }

        $items = $query->orderBy('created_at', 'desc')->get();

        // Calculate ROI for each item based on current valuation
        $currentValuation = $project->currentValuation;
        $currentMetric = $currentValuation?->base_metric_value ?? 0;
        $currentMultiplier = $currentValuation?->multiplier ?? 1;

        $itemsWithROI = $items->map(function ($item) use ($currentMetric, $currentMultiplier) {
            $itemArray = $item->toArray();
            $itemArray['roi'] = $item->getROI($currentMetric, $currentMultiplier);
            $itemArray['is_actionable'] = $item->isActionable();
            $itemArray['has_task'] = $item->hasTask();
            $itemArray['has_offer'] = $item->hasOffer();
            return $itemArray;
        });

        return response()->json([
            'success' => true,
            'data' => $itemsWithROI,
            'categories' => ProjectGrowthItem::CATEGORIES,
            'statuses' => ProjectGrowthItem::STATUSES,
        ]);
    }

    /**
     * Create a new growth item.
     */
    public function store(Request $request, int $projectId): JsonResponse
    {
        $project = Project::findOrFail($projectId);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:5000',
            'category' => 'required|string|in:' . implode(',', ProjectGrowthItem::CATEGORIES),
            'impact_multiplier_increase' => 'sometimes|numeric|min:0|max:50',
            'impact_metric_increase' => 'sometimes|numeric|min:0',
            'confidence_percent' => 'sometimes|integer|min:0|max:100',
            'estimated_cost' => 'sometimes|numeric|min:0',
            'estimated_duration_days' => 'sometimes|integer|min:1|max:730',
        ]);

        $user = User::getAuth();

        $item = new ProjectGrowthItem();
        $item->project_id = $projectId;
        $item->title = $validated['title'];
        $item->description = $validated['description'] ?? null;
        $item->category = $validated['category'];
        $item->impact_multiplier_increase = $validated['impact_multiplier_increase'] ?? 0;
        $item->impact_metric_increase = $validated['impact_metric_increase'] ?? 0;
        $item->confidence_percent = $validated['confidence_percent'] ?? 50;
        $item->estimated_cost = $validated['estimated_cost'] ?? 0;
        $item->estimated_duration_days = $validated['estimated_duration_days'] ?? 30;
        $item->status = ProjectGrowthItem::STATUS_PROPOSED;
        $item->created_by = $user->id;
        $item->save();

        return response()->json([
            'success' => true,
            'data' => $item,
            'message' => 'Growth item created successfully.',
        ], 201);
    }

    /**
     * Update a growth item.
     */
    public function update(Request $request, int $projectId, int $itemId): JsonResponse
    {
        $item = ProjectGrowthItem::forProject($projectId)
            ->where('id', $itemId)
            ->firstOrFail();

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string|max:5000',
            'category' => 'sometimes|string|in:' . implode(',', ProjectGrowthItem::CATEGORIES),
            'impact_multiplier_increase' => 'sometimes|numeric|min:0|max:50',
            'impact_metric_increase' => 'sometimes|numeric|min:0',
            'confidence_percent' => 'sometimes|integer|min:0|max:100',
            'estimated_cost' => 'sometimes|numeric|min:0',
            'estimated_duration_days' => 'sometimes|integer|min:1|max:730',
        ]);

        $item->fill($validated);
        $item->save();

        return response()->json([
            'success' => true,
            'data' => $item,
            'message' => 'Growth item updated.',
        ]);
    }

    /**
     * Change the status of a growth item.
     */
    public function changeStatus(Request $request, int $projectId, int $itemId): JsonResponse
    {
        $item = ProjectGrowthItem::forProject($projectId)
            ->where('id', $itemId)
            ->firstOrFail();

        $validated = $request->validate([
            'status' => 'required|string|in:' . implode(',', ProjectGrowthItem::STATUSES),
        ]);

        $newStatus = $validated['status'];

        switch ($newStatus) {
            case ProjectGrowthItem::STATUS_APPROVED:
                $item->approve();
                break;
            case ProjectGrowthItem::STATUS_IN_PROGRESS:
                $item->startExecution();
                break;
            case ProjectGrowthItem::STATUS_COMPLETED:
                $item->complete();
                break;
            case ProjectGrowthItem::STATUS_REJECTED:
                $item->reject();
                break;
            default:
                $item->status = $newStatus;
                $item->save();
        }

        return response()->json([
            'success' => true,
            'data' => $item->fresh(),
            'message' => "Status changed to {$newStatus}.",
        ]);
    }

    /**
     * Approve a growth item and create linked Task (and optionally Offer).
     */
    public function approveAndExecute(Request $request, int $projectId, int $itemId): JsonResponse
    {
        $item = ProjectGrowthItem::forProject($projectId)
            ->where('id', $itemId)
            ->firstOrFail();

        if (!$item->isActionable()) {
            return response()->json([
                'success' => false,
                'message' => 'This item cannot be approved in its current status.',
            ], 422);
        }

        $options = $request->validate([
            'create_task' => 'sometimes|boolean',
            'assign_to' => 'sometimes|integer|exists:sys_admins,id',
        ]);

        $service = new GrowthItemApprovalService();
        $item = $service->approveAndExecute($item, $options);

        return response()->json([
            'success' => true,
            'data' => $item,
            'message' => 'Growth item approved and execution started.',
        ]);
    }

    /**
     * Delete a growth item (only if proposed or rejected).
     */
    public function destroy(int $projectId, int $itemId): JsonResponse
    {
        $item = ProjectGrowthItem::forProject($projectId)
            ->where('id', $itemId)
            ->firstOrFail();

        if (!in_array($item->status, [ProjectGrowthItem::STATUS_PROPOSED, ProjectGrowthItem::STATUS_REJECTED])) {
            return response()->json([
                'success' => false,
                'message' => 'Can only delete proposed or rejected items.',
            ], 403);
        }

        $item->delete();

        return response()->json([
            'success' => true,
            'message' => 'Growth item deleted.',
        ]);
    }
}
