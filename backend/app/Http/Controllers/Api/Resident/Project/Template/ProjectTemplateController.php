<?php

namespace App\Http\Controllers\Api\Resident\Project\Template;

use App\Http\Controllers\Controller;
use App\Http\Resources\Resident\Project\Template\ProjectTemplateResource;
use App\Http\Resources\Resident\Project\Template\ProjectTemplateSectionResource;
use App\Models\Resident\Project\Template\ProjectTemplate;
use Illuminate\Http\Request;

class ProjectTemplateController extends Controller
{
    /**
     * List all active project templates.
     */
    public function list()
    {
        $templates = ProjectTemplate::active()
            ->with('sections')
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'status' => true,
            'data' => ProjectTemplateResource::collection($templates),
        ]);
    }

    /**
     * Get a single template with its sections.
     */
    public function item(ProjectTemplate $template)
    {
        $template->load('allSections');

        return response()->json([
            'status' => true,
            'data' => new ProjectTemplateResource($template),
        ]);
    }

    /**
     * Get sections for a specific template (used by frontend sidebar).
     */
    public function sections(ProjectTemplate $template)
    {
        $sections = $template->sections;

        return response()->json([
            'status' => true,
            'data' => ProjectTemplateSectionResource::collection($sections),
        ]);
    }

    /**
     * Get sections for a project by its template_code.
     * This is the primary endpoint used by the frontend dynamic sidebar.
     */
    public function sectionsByCode(string $code)
    {
        $template = ProjectTemplate::findByCode($code);

        if (!$template) {
            return response()->json([
                'status' => false,
                'message' => 'Template not found',
            ], 404);
        }

        $sections = $template->sections;

        return response()->json([
            'status' => true,
            'data' => ProjectTemplateSectionResource::collection($sections),
        ]);
    }

    /**
     * Create a new project template (admin only).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:project_templates,code',
            'name' => 'required|string|max:150',
            'description' => 'nullable|string',
            'default_roles' => 'nullable|array',
            'default_statuses' => 'nullable|array',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $template = ProjectTemplate::create($validated);

        return response()->json([
            'status' => true,
            'data' => new ProjectTemplateResource($template),
        ], 201);
    }

    /**
     * Update an existing project template.
     */
    public function update(Request $request, ProjectTemplate $template)
    {
        $validated = $request->validate([
            'code' => 'sometimes|string|max:50|unique:project_templates,code,' . $template->id,
            'name' => 'sometimes|string|max:150',
            'description' => 'nullable|string',
            'default_roles' => 'nullable|array',
            'default_statuses' => 'nullable|array',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $template->update($validated);

        return response()->json([
            'status' => true,
            'data' => new ProjectTemplateResource($template),
        ]);
    }
}
