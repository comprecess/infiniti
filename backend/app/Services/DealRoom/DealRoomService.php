<?php

namespace App\Services\DealRoom;

use App\Models\Resident\Project\Project;
use App\Models\Resident\Project\ProjectMetadata;

/**
 * DealRoomService — manages Deal Room folder structure for Exit Deal projects.
 *
 * Uses clx_shared_preferences to store folder categories.
 * Documents are linked via existing sys_documents + ib_doc_rel system.
 *
 * Universal: can be reused for Fundraising (investor data room),
 * Venture Building (partner documents), Acquisition (due diligence).
 */
class DealRoomService
{
    /**
     * Default folder categories for Exit Deal projects.
     * These are stored as metadata and used for UI filtering.
     */
    const EXIT_DEAL_FOLDERS = [
        'financial' => 'Financial Documents',
        'legal' => 'Legal Documents',
        'operational' => 'Operational Documents',
        'commercial' => 'Commercial & Sales',
        'technical' => 'Technical & IP',
        'hr' => 'HR & Team',
        'compliance' => 'Compliance & Regulatory',
        'marketing' => 'Marketing Materials',
    ];

    /**
     * Fundraising folder categories (for future use).
     */
    const FUNDRAISING_FOLDERS = [
        'pitch' => 'Pitch Materials',
        'financial' => 'Financial Projections',
        'legal' => 'Legal Documents',
        'cap_table' => 'Cap Table & Equity',
        'product' => 'Product Documentation',
        'references' => 'References & Testimonials',
    ];

    /**
     * Initialize Deal Room folders for a project.
     * Stores folder structure in metadata (no new tables needed).
     */
    public static function initializeFolders(int $projectId, string $templateCode = 'exit_deal'): void
    {
        $folders = self::getFolderConfig($templateCode);

        foreach ($folders as $code => $name) {
            ProjectMetadata::setValue($projectId, 'dealroom_folders', $code, $name);
        }

        // Mark deal room as initialized
        ProjectMetadata::setValue($projectId, 'dealroom', 'initialized', 'true');
        ProjectMetadata::setValue($projectId, 'dealroom', 'initialized_at', now()->toISOString());
    }

    /**
     * Get folder configuration based on template code.
     */
    public static function getFolderConfig(string $templateCode): array
    {
        return match ($templateCode) {
            'exit_deal' => self::EXIT_DEAL_FOLDERS,
            'fundraising' => self::FUNDRAISING_FOLDERS,
            default => self::EXIT_DEAL_FOLDERS,
        };
    }

    /**
     * Get all Deal Room folders for a project.
     */
    public static function getFolders(int $projectId): array
    {
        return ProjectMetadata::getGroup($projectId, 'dealroom_folders');
    }

    /**
     * Check if Deal Room is initialized for a project.
     */
    public static function isInitialized(int $projectId): bool
    {
        $value = ProjectMetadata::getValue($projectId, 'dealroom', 'initialized');
        return $value === 'true';
    }

    /**
     * Assign a document to a Deal Room folder category.
     * Uses clx_shared_preferences with key: dealroom_doc.{document_id} = category_code
     */
    public static function assignDocumentToFolder(int $projectId, int $documentId, string $folderCode): void
    {
        ProjectMetadata::setValue($projectId, 'dealroom_doc', (string) $documentId, $folderCode);
    }

    /**
     * Get the folder assignment for a document.
     */
    public static function getDocumentFolder(int $projectId, int $documentId): ?string
    {
        return ProjectMetadata::getValue($projectId, 'dealroom_doc', (string) $documentId);
    }

    /**
     * Get all document IDs assigned to a specific folder.
     */
    public static function getDocumentsInFolder(int $projectId, string $folderCode): array
    {
        $allDocs = ProjectMetadata::getGroup($projectId, 'dealroom_doc');
        $result = [];

        foreach ($allDocs as $docId => $folder) {
            if ($folder === $folderCode) {
                $result[] = (int) $docId;
            }
        }

        return $result;
    }

    /**
     * Get folder statistics (document count per folder).
     */
    public static function getFolderStats(int $projectId): array
    {
        $folders = self::getFolders($projectId);
        $allDocs = ProjectMetadata::getGroup($projectId, 'dealroom_doc');

        // Get IDs of documents that actually exist in the database
        $allDocIds = array_map('intval', array_keys($allDocs));
        $existingIds = [];
            $existingIds = \App\Models\Resident\Document::whereIn('id', $allDocIds)
                ->pluck('id')
                ->map(fn($id) => (string) $id)
                ->toArray();
        }

        $stats = [];
        foreach ($folders as $code => $name) {
            $count = 0;
            foreach ($allDocs as $docId => $folder) {
                if ($folder === $code && in_array((string) $docId, $existingIds)) {
                    $count++;
                }
            }
            $stats[$code] = [
                'name' => $name,
                'count' => $count,
            ];
        }

        return $stats;
    }
}
