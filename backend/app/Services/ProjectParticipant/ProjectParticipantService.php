<?php

namespace App\Services\ProjectParticipant;

use App\Models\PersonalModel;
use App\Models\Resident\Project\Project;
use App\Models\Users\Client;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * ProjectParticipantService — manages participant invitations and role assignments.
 *
 * Handles:
 * - Adding participants with roles (founder, investor, buyer)
 * - Generating invite tokens for new external users
 * - Listing participants with their roles
 * - Removing participants
 *
 * Reuses: personal_model table (data JSON for role), crm_accounts for external users.
 */
class ProjectParticipantService
{
    /**
     * Valid participant roles for Exit Deal projects.
     */
    const ROLES = ['founder', 'investor', 'buyer'];

    /**
     * Add a participant to a project with a specific role.
     *
     * @param Project $project
     * @param Client $client
     * @param string $role  One of: founder, investor, buyer
     * @return PersonalModel
     */
    public static function addParticipant(Project $project, Client $client, string $role): PersonalModel
    {
        // Check if already a participant
        $existing = PersonalModel::where('model_type', Project::class)
            ->where('model_id', $project->id)
            ->where('user_type', Client::class)
            ->where('user_id', $client->id)
            ->first();

        if ($existing) {
            // Update role if already exists
            $data = $existing->data ?? [];
            $data['role'] = $role;
            $existing->data = $data;
            $existing->save();
            return $existing;
        }

        // Create new participant entry
        $personal = new PersonalModel();
        $personal->setUser($client);
        $personal->setModel($project);
        $personal->data = [
            'role' => $role,
            'invited_at' => now()->toISOString(),
        ];
        $personal->save();

        return $personal;
    }

    /**
     * Invite a new external user to a project.
     * Creates crm_accounts entry if email doesn't exist, then adds as participant.
     *
     * @param Project $project
     * @param array $userData  ['email', 'name', 'company' (optional)]
     * @param string $role
     * @return array ['client' => Client, 'personal' => PersonalModel, 'is_new' => bool]
     */
    public static function inviteParticipant(Project $project, array $userData, string $role): array
    {
        return DB::transaction(function () use ($project, $userData, $role) {
            $email = strtolower(trim($userData['email']));
            $isNew = false;

            // Find or create client
            $client = Client::where('email', $email)->first();

            if (!$client) {
                $isNew = true;
                $client = new Client();
                $client->email = $email;
                $client->account = $userData['name'] ?? '';
                $client->fname = $userData['first_name'] ?? explode(' ', $userData['name'] ?? '')[0] ?? '';
                $client->lname = $userData['last_name'] ?? explode(' ', $userData['name'] ?? '')[1] ?? '';
                $client->company = $userData['company'] ?? '';
                $client->status = 'Active';
                $client->type = Client::TYPE[0]; // Customer
                $client->password = bcrypt(Str::random(16)); // Random password, will be reset
                $client->autologin = Str::random(32);
                $client->save();
            }

            // Add as participant with role
            $personal = self::addParticipant($project, $client, $role);

            return [
                'client' => $client,
                'personal' => $personal,
                'is_new' => $isNew,
            ];
        });
    }

    /**
     * Remove a participant from a project.
     */
    public static function removeParticipant(Project $project, Client $client): bool
    {
        return PersonalModel::where('model_type', Project::class)
            ->where('model_id', $project->id)
            ->where('user_type', Client::class)
            ->where('user_id', $client->id)
            ->delete() > 0;
    }

    /**
     * Get all participants for a project with their roles.
     *
     * @return array  [['client' => Client, 'role' => string, 'invited_at' => string], ...]
     */
    public static function getParticipants(Project $project, ?string $roleFilter = null): array
    {
        $query = PersonalModel::where('model_type', Project::class)
            ->where('model_id', $project->id)
            ->where('user_type', Client::class)
            ->with('user');

        $personals = $query->get();
        $result = [];

        foreach ($personals as $personal) {
            $data = $personal->data ?? [];
            $role = $data['role'] ?? 'founder';

            if ($roleFilter && $role !== $roleFilter) {
                continue;
            }

            $result[] = [
                'id' => $personal->id,
                'client' => $personal->user,
                'role' => $role,
                'invited_at' => $data['invited_at'] ?? $personal->created_at?->toISOString(),
            ];
        }

        return $result;
    }

    /**
     * Get the role of a specific user in a project.
     */
    public static function getRole(Project $project, Client $client): ?string
    {
        // Owner check
        if ($project->contact_id == $client->id) {
            return 'owner';
        }

        $personal = PersonalModel::where('model_type', Project::class)
            ->where('model_id', $project->id)
            ->where('user_type', Client::class)
            ->where('user_id', $client->id)
            ->first();

        if (!$personal) {
            return null;
        }

        $data = $personal->data ?? [];
        return $data['role'] ?? 'founder';
    }

    /**
     * Update a participant's role.
     */
    public static function updateRole(Project $project, Client $client, string $newRole): bool
    {
        $personal = PersonalModel::where('model_type', Project::class)
            ->where('model_id', $project->id)
            ->where('user_type', Client::class)
            ->where('user_id', $client->id)
            ->first();

        if (!$personal) {
            return false;
        }

        $data = $personal->data ?? [];
        $data['role'] = $newRole;
        $personal->data = $data;
        $personal->save();

        return true;
    }

    /**
     * Generate an autologin URL for a participant.
     * Uses the existing autologin mechanism in crm_accounts.
     */
    public static function generateAccessLink(Client $client, Project $project): string
    {
        // Ensure autologin token exists
        if (empty($client->autologin)) {
            $client->autologin = Str::random(32);
            $client->save();
        }

        $baseUrl = config('app.frontend_url', config('app.url'));
        return "{$baseUrl}/client/autologin/{$client->autologin}?redirect=/projects/{$project->id}";
    }
}
