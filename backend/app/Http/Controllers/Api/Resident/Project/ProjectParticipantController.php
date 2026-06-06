<?php

namespace App\Http\Controllers\Api\Resident\Project;

use App\Http\Controllers\Controller;
use App\Models\Resident\Project\Project;
use App\Models\Users\Client;
use App\Services\ProjectParticipant\ProjectParticipantService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * ProjectParticipantController — manages project participants (Investor/Buyer invites).
 *
 * Admin-side controller for inviting external users to Exit Deal projects.
 * Creates crm_accounts entries and personal_model links with role data.
 */
class ProjectParticipantController extends Controller
{
    /**
     * List all participants for a project with their roles.
     */
    public function index(int $projectId): JsonResponse
    {
        $project = Project::findOrFail($projectId);

        $participants = ProjectParticipantService::getParticipants($project);

        // Include project owner info
        $owner = null;
        if ($project->contact_id) {
            $ownerClient = Client::find($project->contact_id);
            if ($ownerClient) {
                $owner = [
                    'id' => null,
                    'client' => [
                        'id' => $ownerClient->id,
                        'account' => $ownerClient->account,
                        'email' => $ownerClient->email,
                        'company' => $ownerClient->company,
                    ],
                    'role' => 'owner',
                    'invited_at' => $project->created_at?->toISOString(),
                ];
            }
        }

        $result = [];
        if ($owner) {
            $result[] = $owner;
        }

        foreach ($participants as $p) {
            $client = $p['client'];
            $result[] = [
                'id' => $p['id'],
                'client' => $client ? [
                    'id' => $client->id,
                    'account' => $client->account,
                    'email' => $client->email,
                    'company' => $client->company,
                ] : null,
                'role' => $p['role'],
                'invited_at' => $p['invited_at'],
            ];
        }

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }

    /**
     * Invite a participant to the project.
     * Creates crm_accounts entry if needed, adds personal_model with role.
     */
    public function invite(Request $request, int $projectId): JsonResponse
    {
        $project = Project::findOrFail($projectId);

        // Only Exit Deal projects support role-based participants
        if ($project->isLegacy()) {
            return response()->json([
                'success' => false,
                'message' => 'Participant roles are only available for template-based projects.',
            ], 422);
        }

        $validated = $request->validate([
            'email' => 'required|email|max:255',
            'name' => 'required|string|max:255',
            'company' => 'nullable|string|max:255',
            'role' => 'required|string|in:' . implode(',', ProjectParticipantService::ROLES),
        ]);

        $result = ProjectParticipantService::inviteParticipant($project, $validated, $validated['role']);

        $accessLink = ProjectParticipantService::generateAccessLink($result['client'], $project);

        return response()->json([
            'success' => true,
            'data' => [
                'client_id' => $result['client']->id,
                'is_new_account' => $result['is_new'],
                'role' => $validated['role'],
                'access_link' => $accessLink,
            ],
            'message' => $result['is_new']
                ? "New account created and invited as {$validated['role']}."
                : "Existing user invited as {$validated['role']}.",
        ], 201);
    }

    /**
     * Update a participant's role.
     */
    public function updateRole(Request $request, int $projectId, int $clientId): JsonResponse
    {
        $project = Project::findOrFail($projectId);
        $client = Client::findOrFail($clientId);

        $validated = $request->validate([
            'role' => 'required|string|in:' . implode(',', ProjectParticipantService::ROLES),
        ]);

        $updated = ProjectParticipantService::updateRole($project, $client, $validated['role']);

        if (!$updated) {
            return response()->json([
                'success' => false,
                'message' => 'Participant not found in this project.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => "Role updated to {$validated['role']}.",
        ]);
    }

    /**
     * Remove a participant from the project.
     */
    public function remove(int $projectId, int $clientId): JsonResponse
    {
        $project = Project::findOrFail($projectId);
        $client = Client::findOrFail($clientId);

        // Cannot remove the project owner
        if ($project->contact_id == $client->id) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot remove the project owner.',
            ], 422);
        }

        $removed = ProjectParticipantService::removeParticipant($project, $client);

        return response()->json([
            'success' => $removed,
            'message' => $removed ? 'Participant removed.' : 'Participant not found.',
        ]);
    }

    /**
     * Generate a fresh access link for a participant.
     */
    public function accessLink(int $projectId, int $clientId): JsonResponse
    {
        $project = Project::findOrFail($projectId);
        $client = Client::findOrFail($clientId);

        $link = ProjectParticipantService::generateAccessLink($client, $project);

        return response()->json([
            'success' => true,
            'data' => [
                'access_link' => $link,
            ],
        ]);
    }
}
