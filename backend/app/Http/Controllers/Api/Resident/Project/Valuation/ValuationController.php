<?php

namespace App\Http\Controllers\Api\Resident\Project\Valuation;

use App\Http\Controllers\Controller;
use App\Models\Resident\Project\Project;
use App\Models\Resident\Project\Valuation\ProjectValuation;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ValuationController extends Controller
{
    /**
     * Get the valuation dashboard for a project.
     * Returns: current, projected, best_case valuations + history.
     */
    public function dashboard(int $projectId): JsonResponse
    {
        $project = Project::findOrFail($projectId);

        $current = ProjectValuation::getLatestCurrent($projectId);
        $projected = ProjectValuation::calculateProjected($projectId);
        $bestCase = ProjectValuation::calculateBestCase($projectId);

        $history = ProjectValuation::forProject($projectId)
            ->ofType(ProjectValuation::TYPE_CURRENT)
            ->orderBy('created_at', 'desc')
            ->limit(12)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'current' => $current,
                'projected' => $projected,
                'best_case' => $bestCase,
                'history' => $history,
                'metrics' => ProjectValuation::METRICS,
            ],
        ]);
    }

    /**
     * Create or update the current valuation.
     */
    public function store(Request $request, int $projectId): JsonResponse
    {
        $project = Project::findOrFail($projectId);

        $validated = $request->validate([
            'base_metric_name' => 'required|string|in:' . implode(',', ProjectValuation::METRICS),
            'base_metric_value' => 'required|numeric|min:0',
            'multiplier' => 'required|numeric|min:0.1|max:100',
            'confidence_percent' => 'sometimes|integer|min:0|max:100',
            'notes' => 'nullable|string|max:2000',
        ]);

        $user = User::getAuth();

        $valuation = new ProjectValuation();
        $valuation->project_id = $projectId;
        $valuation->valuation_type = ProjectValuation::TYPE_CURRENT;
        $valuation->base_metric_name = $validated['base_metric_name'];
        $valuation->base_metric_value = $validated['base_metric_value'];
        $valuation->multiplier = $validated['multiplier'];
        $valuation->confidence_percent = $validated['confidence_percent'] ?? 100;
        $valuation->notes = $validated['notes'] ?? null;
        $valuation->created_by = $user->id;
        $valuation->save();

        return response()->json([
            'success' => true,
            'data' => $valuation,
            'message' => 'Valuation created successfully.',
        ], 201);
    }

    /**
     * Get valuation history for a project.
     */
    public function history(int $projectId): JsonResponse
    {
        $valuations = ProjectValuation::forProject($projectId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $valuations,
        ]);
    }

    /**
     * Delete a valuation entry (only non-final).
     */
    public function destroy(int $projectId, int $valuationId): JsonResponse
    {
        $valuation = ProjectValuation::forProject($projectId)
            ->where('id', $valuationId)
            ->firstOrFail();

        if ($valuation->valuation_type === ProjectValuation::TYPE_FINAL) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete a final valuation.',
            ], 403);
        }

        $valuation->delete();

        return response()->json([
            'success' => true,
            'message' => 'Valuation deleted.',
        ]);
    }
}
