<?php

namespace App\Http\Controllers\Api\Client\Project;

use App\Http\Controllers\Controller;
use App\Http\Middleware\ProjectParticipantAccess;
use App\Models\PersonalModel;
use App\Models\Resident\Project\Project;
use App\Models\Resident\Project\ProjectMetadata;
use App\Models\Resident\Project\Valuation\ProjectValuation;
use App\Models\Resident\Project\GrowthItem\ProjectGrowthItem;
use App\Models\Users\Client;
use App\Services\DealRoom\DealRoomService;
use App\Services\ProjectParticipant\ProjectParticipantService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * ProjectExitController — Client-portal controller for Exit Deal project access.
 *
 * Provides role-based access to project sections for external users (Founder/Investor/Buyer).
 * Access levels are enforced per config/data/project_access.php.
 */
class ProjectExitController extends Controller
{
    /**
     * Get project overview with role-based section visibility.
     */
    public function overview(Request $request, int $projectId): JsonResponse
    {
        $project = Project::findOrFail($projectId);
        $user = auth()->user();

        $role = $this->getRole($user, $project);
        if (!$role) {
            abort(403, 'No access to this project.');
        }

        $config = config("data.project_access.{$role}", []);
        $sections = array_keys($config['sections'] ?? []);

        return response()->json([
            'success' => true,
            'data' => [
                'project' => [
                    'id' => $project->id,
                    'name' => $project->name,
                    'template_code' => $project->template_code,
                    'status' => $project->status,
                ],
                'role' => $role,
                'permitted_sections' => $sections,
            ],
        ]);
    }

    /**
     * Get Deal Room data — filtered by permitted folders.
     */
    public function dealRoom(Request $request, int $projectId): JsonResponse
    {
        $project = Project::findOrFail($projectId);
        $user = auth()->user();

        $this->checkSectionAccess($user, $project, 'deal_room');

        $permittedFolders = ProjectParticipantAccess::getPermittedFolders($user, $project);
        $allStats = DealRoomService::getFolderStats($projectId);

        // Filter folders if restricted
        if ($permittedFolders !== null) {
            $allStats = array_filter($allStats, function ($key) use ($permittedFolders) {
                return in_array($key, $permittedFolders);
            }, ARRAY_FILTER_USE_KEY);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'folders' => $allStats,
            ],
        ]);
    }

    /**
     * Get documents in a specific Deal Room folder.
     */
    public function dealRoomFolder(Request $request, int $projectId, string $folderCode): JsonResponse
    {
        $project = Project::findOrFail($projectId);
        $user = auth()->user();

        $this->checkSectionAccess($user, $project, 'deal_room');

        // Check folder permission
        $permittedFolders = ProjectParticipantAccess::getPermittedFolders($user, $project);
        if ($permittedFolders !== null && !in_array($folderCode, $permittedFolders)) {
            abort(403, 'Access denied to this folder.');
        }

        $documentIds = DealRoomService::getDocumentsInFolder($projectId, $folderCode);

        if (empty($documentIds)) {
            return response()->json([
                'success' => true,
                'data' => [],
            ]);
        }

        $documents = $project->documents()
            ->whereIn('sys_documents.id', $documentIds)
            ->filesExists()
            ->get()
            ->map(function ($doc) {
                return [
                    'id' => $doc->id,
                    'name' => $doc->original_name ?? $doc->name,
                    'size' => $doc->size,
                    'created_at' => $doc->created_at,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $documents,
        ]);
    }

    /**
     * Get valuation data — full or summary based on role.
     */
    public function valuation(Request $request, int $projectId): JsonResponse
    {
        $project = Project::findOrFail($projectId);
        $user = auth()->user();

        $accessLevel = $this->checkSectionAccess($user, $project, 'valuation');

        $current = ProjectValuation::getLatestCurrent($projectId);
        $projected = ProjectValuation::calculateProjected($projectId);

        if ($accessLevel === 'summary') {
            // Summary: only total values, no breakdown
            return response()->json([
                'success' => true,
                'data' => [
                    'current_total' => $current ? $current->total_value : 0,
                    'projected_total' => $projected['total_value'] ?? 0,
                    'confidence' => $projected['confidence_percent'] ?? 0,
                    'access_level' => 'summary',
                ],
            ]);
        }

        // Full access
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
                'access_level' => 'full',
            ],
        ]);
    }

    /**
     * Get growth plan data — full or read-only based on role.
     */
    public function growthPlan(Request $request, int $projectId): JsonResponse
    {
        $project = Project::findOrFail($projectId);
        $user = auth()->user();

        $accessLevel = $this->checkSectionAccess($user, $project, 'growth_plan');

        $items = ProjectGrowthItem::forProject($projectId)
            ->active()
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($item) use ($accessLevel) {
                $data = [
                    'id' => $item->id,
                    'title' => $item->title,
                    'category' => $item->category,
                    'status' => $item->status,
                    'confidence_percent' => $item->confidence_percent,
                    'estimated_duration_days' => $item->estimated_duration_days,
                ];

                // Full access includes cost and impact details
                if ($accessLevel === 'full') {
                    $data['description'] = $item->description;
                    $data['estimated_cost'] = $item->estimated_cost;
                    $data['impact_multiplier_increase'] = $item->impact_multiplier_increase;
                    $data['impact_metric_increase'] = $item->impact_metric_increase;
                }

                return $data;
            });

        return response()->json([
            'success' => true,
            'data' => [
                'items' => $items,
                'access_level' => $accessLevel,
            ],
        ]);
    }

    /**
     * Get invoices for the current user in this project.
     */
    public function invoices(Request $request, int $projectId): JsonResponse
    {
        $project = Project::findOrFail($projectId);
        $user = auth()->user();

        $this->checkSectionAccess($user, $project, 'invoices');

        $invoices = $project->invoices()
            ->where('userid', $user->id)
            ->orderByDesc('id')
            ->get()
            ->map(function ($inv) {
                return [
                    'id' => $inv->id,
                    'code' => $inv->getCode(),
                    'total' => $inv->total,
                    'status' => $inv->status,
                    'date' => $inv->date,
                    'duedate' => $inv->duedate,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $invoices,
        ]);
    }

    /**
     * Get offers for the current user in this project.
     */
    public function offers(Request $request, int $projectId): JsonResponse
    {
        $project = Project::findOrFail($projectId);
        $user = auth()->user();

        $this->checkSectionAccess($user, $project, 'offers');

        $offers = \App\Models\Resident\Invoices\Offer::where('userid', $user->id)
            ->orderByDesc('id')
            ->get()
            ->map(function ($offer) {
                return [
                    'id' => $offer->id,
                    'code' => $offer->getCode(),
                    'subject' => $offer->subject,
                    'total' => $offer->total,
                    'stage' => $offer->stage,
                    'datecreated' => $offer->datecreated,
                    'validuntil' => $offer->validuntil,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $offers,
        ]);
    }

    // ─── Helpers ─────────────────────────────────────────────────────

    /**
     * Get the user's role in the project.
     */
    protected function getRole(Client $user, Project $project): ?string
    {
        return ProjectParticipantAccess::resolveRole($user, $project);
    }

    /**
     * Check section access and return the access level. Aborts with 403 if denied.
     */
    protected function checkSectionAccess(Client $user, Project $project, string $section): string
    {
        $accessLevel = ProjectParticipantAccess::checkAccess($user, $project, $section);
        if (!$accessLevel) {
            abort(403, "Access denied to section: {$section}");
        }
        return $accessLevel;
    }
}
