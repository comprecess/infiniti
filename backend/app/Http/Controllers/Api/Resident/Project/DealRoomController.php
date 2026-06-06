<?php

namespace App\Http\Controllers\Api\Resident\Project;

use App\Http\Controllers\Controller;
use App\Http\Resources\Resident\DocumentResource;
use App\Models\Resident\Document;
use App\Models\Resident\Project\Project;
use App\Services\DealRoom\DealRoomService;
use Illuminate\Http\Request;

/**
 * DealRoomController — manages Deal Room for Exit Deal projects.
 *
 * Reuses existing sys_documents and ib_doc_rel system.
 * Folder categorization is stored in clx_shared_preferences.
 *
 * Universal: same controller can serve Fundraising data rooms,
 * Venture Building partner docs, and Acquisition due diligence.
 */
class DealRoomController extends Controller
{
    /**
     * Get Deal Room overview: folders with document counts.
     */
    public function index(int $projectId)
    {
        $project = Project::findOrFail($projectId);

        // Auto-initialize if not yet done
        if (!DealRoomService::isInitialized($projectId)) {
            $templateCode = $project->template_code ?? 'exit_deal';
            DealRoomService::initializeFolders($projectId, $templateCode);
        }

        $stats = DealRoomService::getFolderStats($projectId);

        return response()->json([
            'status' => true,
            'data' => [
                'folders' => $stats,
                'initialized' => true,
            ],
        ]);
    }

    /**
     * Get documents in a specific folder.
     * Reuses existing document query with filtering.
     */
    public function folder(int $projectId, string $folderCode)
    {
        $project = Project::findOrFail($projectId);

        $documentIds = DealRoomService::getDocumentsInFolder($projectId, $folderCode);

        if (empty($documentIds)) {
            return response()->json([
                'status' => true,
                'data' => [],
            ]);
        }

        $documents = $project->documents()
            ->whereIn('sys_documents.id', $documentIds)
            ->filesExists()
            ->get();

        return response()->json([
            'status' => true,
            'data' => DocumentResource::collection($documents),
        ]);
    }

    /**
     * Assign a document to a Deal Room folder.
     * The document must already be attached to the project via existing upload flow.
     */
    public function assignDocument(Request $request, int $projectId)
    {
        $project = Project::findOrFail($projectId);

        $validated = $request->validate([
            'document_id' => 'required|integer|exists:sys_documents,id',
            'folder' => 'required|string|max:50',
        ]);

        // Verify document belongs to this project
        $exists = $project->documents()
            ->where('sys_documents.id', $validated['document_id'])
            ->exists();

        if (!$exists) {
            return response()->json([
                'status' => false,
                'message' => 'Document not found in this project',
            ], 404);
        }

        DealRoomService::assignDocumentToFolder(
            $projectId,
            $validated['document_id'],
            $validated['folder']
        );

        return response()->json([
            'status' => true,
            'message' => 'Document assigned to folder',
        ]);
    }

    /**
     * Remove a document from Deal Room folder assignment.
     * Does NOT delete the document — only removes the folder tag.
     */
    public function unassignDocument(int $projectId, int $documentId)
    {
        Project::findOrFail($projectId);

        $deleted = \App\Models\Resident\Project\ProjectMetadata::deleteKey(
            $projectId,
            'dealroom_doc',
            (string) $documentId
        );

        return response()->json([
            'status' => true,
            'removed' => $deleted,
        ]);
    }

    /**
     * Get all project documents with their Deal Room folder assignments.
     * Useful for the UI to show which docs are categorized and which are not.
     */
    public function allDocuments(int $projectId)
    {
        $project = Project::findOrFail($projectId);

        $documents = $project->documents()->filesExists()->get();
        $allAssignments = \App\Models\Resident\Project\ProjectMetadata::getGroup($projectId, 'dealroom_doc');

        $result = [];
        foreach ($documents as $doc) {
            $result[] = [
                'document' => new DocumentResource($doc),
                'folder' => $allAssignments[(string) $doc->id] ?? null,
            ];
        }

        return response()->json([
            'status' => true,
            'data' => $result,
        ]);
    }
}
