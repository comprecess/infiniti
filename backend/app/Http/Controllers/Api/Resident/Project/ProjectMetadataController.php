<?php

namespace App\Http\Controllers\Api\Resident\Project;

use App\Http\Controllers\Controller;
use App\Models\Resident\Project\Project;
use App\Models\Resident\Project\ProjectMetadata;
use Illuminate\Http\Request;

class ProjectMetadataController extends Controller
{
    /**
     * Get all metadata for a project, grouped by dot-notation prefix.
     */
    public function index(int $projectId)
    {
        Project::findOrFail($projectId);
        $metadata = ProjectMetadata::getGrouped($projectId);

        return response()->json([
            'status' => true,
            'data' => $metadata,
        ]);
    }

    /**
     * Get metadata for a specific group.
     */
    public function group(int $projectId, string $group)
    {
        Project::findOrFail($projectId);
        $items = ProjectMetadata::getGroup($projectId, $group);

        return response()->json([
            'status' => true,
            'data' => $items,
        ]);
    }

    /**
     * Store or update metadata values (batch upsert).
     * Expects: { "group": "onboarding", "data": { "company_name": "Acme", "mrr": "50000" } }
     */
    public function store(Request $request, int $projectId)
    {
        Project::findOrFail($projectId);

        $validated = $request->validate([
            'group' => 'required|string|max:100',
            'data' => 'required|array',
            'data.*' => 'nullable|string',
        ]);

        ProjectMetadata::setGroup($projectId, $validated['group'], $validated['data']);

        return response()->json([
            'status' => true,
            'data' => ProjectMetadata::getGrouped($projectId),
        ]);
    }

    /**
     * Delete a specific metadata entry.
     */
    public function destroy(int $projectId, string $group, string $key)
    {
        Project::findOrFail($projectId);
        $deleted = ProjectMetadata::deleteKey($projectId, $group, $key);

        return response()->json([
            'status' => true,
            'deleted' => $deleted,
        ]);
    }
}
