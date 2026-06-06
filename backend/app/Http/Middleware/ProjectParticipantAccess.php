<?php

namespace App\Http\Middleware;

use App\Models\PersonalModel;
use App\Models\Resident\Project\Project;
use App\Models\Users\Client;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * ProjectParticipantAccess — enforces role-based section access for external users.
 *
 * Reads participant role from personal_model.data JSON: {"role": "founder|investor|buyer"}
 * Checks requested section against config/data/project_access.php rules.
 * Returns 403 if access denied.
 *
 * Applied to client routes that access project sections.
 */
class ProjectParticipantAccess
{
    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure $next
     * @param string|null $section  Optional section override (from route parameter)
     * @return Response
     */
    public function handle(Request $request, Closure $next, ?string $section = null): Response
    {
        $user = auth()->user();

        // Only applies to Client (external) users
        if (!($user instanceof Client)) {
            return $next($request);
        }

        $project = $this->resolveProject($request);
        if (!$project) {
            return $next($request);
        }

        // Legacy projects bypass this middleware
        if ($project->isLegacy()) {
            return $next($request);
        }

        // Resolve the section being accessed
        $section = $section ?? $this->resolveSectionFromRequest($request);
        if (!$section) {
            return $next($request);
        }

        // Determine user's role in this project
        $role = $this->resolveRole($user, $project);
        if (!$role) {
            abort(403, 'No access to this project.');
        }

        // Check section access
        $accessLevel = $this->getAccessLevel($role, $section);
        if (!$accessLevel) {
            abort(403, 'Access denied for this section.');
        }

        // Store access context for controllers to use
        $request->attributes->set('project_role', $role);
        $request->attributes->set('project_access_level', $accessLevel);
        $request->attributes->set('project_access_config', $this->getRoleConfig($role));

        return $next($request);
    }

    /**
     * Resolve the project from the request.
     */
    protected function resolveProject(Request $request): ?Project
    {
        // Try route parameter
        $projectId = $request->route('project') ?? $request->route('projectId');

        if ($projectId instanceof Project) {
            return $projectId;
        }

        if ($projectId && is_numeric($projectId)) {
            return Project::find($projectId);
        }

        return null;
    }

    /**
     * Resolve the section code from the request route.
     */
    protected function resolveSectionFromRequest(Request $request): ?string
    {
        // For viewProcess routes: type parameter maps to section
        $type = $request->route('type');
        if ($type) {
            $map = config('data.project_access.route_section_map', []);
            return $map[$type] ?? $type;
        }

        // For dedicated routes (e.g., /project/{id}/deal-room)
        $path = $request->path();
        $map = config('data.project_access.route_section_map', []);

        foreach ($map as $routeKey => $sectionCode) {
            if (str_contains($path, $routeKey)) {
                return $sectionCode;
            }
        }

        return null;
    }

    /**
     * Determine the user's role in the project.
     *
     * Priority:
     * 1. Project owner (contact_id) → 'owner'
     * 2. Participant with role in personal_model.data → role from JSON
     * 3. Participant without role data → 'founder' (backward compat)
     * 4. No relationship → null (no access)
     */
    public static function resolveRole(Client $user, Project $project): ?string
    {
        // Check if user is the project owner
        if ($project->contact_id == $user->id) {
            return 'owner';
        }

        // Check personal_model for participant entry
        $personal = PersonalModel::where('model_type', Project::class)
            ->where('model_id', $project->id)
            ->where('user_type', Client::class)
            ->where('user_id', $user->id)
            ->first();

        if (!$personal) {
            return null;
        }

        // Extract role from data JSON
        $data = $personal->data;
        if (is_array($data) && isset($data['role'])) {
            return $data['role'];
        }

        // Backward compatibility: participant without explicit role = founder
        return 'founder';
    }

    /**
     * Get the access level for a role+section combination.
     *
     * @return string|null  'full', 'read', 'summary', or null (no access)
     */
    protected function getAccessLevel(string $role, string $section): ?string
    {
        $config = $this->getRoleConfig($role);
        if (!$config) {
            return null;
        }

        return $config['sections'][$section] ?? null;
    }

    /**
     * Get the full config for a role.
     */
    protected function getRoleConfig(string $role): ?array
    {
        return config("data.project_access.{$role}");
    }

    /**
     * Static helper: check if a user has access to a specific section of a project.
     * Can be called from controllers without going through middleware.
     */
    public static function checkAccess(Client $user, Project $project, string $section): ?string
    {
        $role = self::resolveRole($user, $project);
        if (!$role) {
            return null;
        }

        $config = config("data.project_access.{$role}");
        if (!$config) {
            return null;
        }

        return $config['sections'][$section] ?? null;
    }

    /**
     * Static helper: get permitted Deal Room folders for a user.
     */
    public static function getPermittedFolders(Client $user, Project $project): ?array
    {
        $role = self::resolveRole($user, $project);
        if (!$role) {
            return [];
        }

        $config = config("data.project_access.{$role}");
        return $config['deal_room_folders'] ?? null; // null = all folders
    }
}
