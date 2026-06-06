<?php

namespace App\Models\Resident\Project;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * ProjectMetadata — facade over clx_shared_preferences for project-scoped key-value storage.
 * Uses dot-notation in the `key` field for grouping: "onboarding.company_name", "financials.mrr".
 *
 * This model is universal and can be reused for Fundraising, Venture Building, Acquisition
 * by simply using different key prefixes.
 */
class ProjectMetadata extends Model
{
    use HasFactory;

    protected $table = 'clx_shared_preferences';

    protected $fillable = [
        'relation_type',
        'relation_id',
        'key',
        'value',
    ];

    /**
     * The relation_type constant for projects.
     */
    const RELATION_TYPE = 'project';

    /**
     * Get the parent project.
     */
    public function project()
    {
        return $this->belongsTo(Project::class, 'relation_id');
    }

    /**
     * Scope to project metadata only.
     */
    public function scopeForProject($query, int $projectId)
    {
        return $query->where('relation_type', self::RELATION_TYPE)
            ->where('relation_id', $projectId);
    }

    /**
     * Scope by group (dot-notation prefix).
     * e.g., group "onboarding" matches keys like "onboarding.company_name"
     */
    public function scopeGroup($query, string $group)
    {
        return $query->where('key', 'LIKE', $group . '.%');
    }

    /**
     * Build the full dot-notation key from group and key name.
     */
    public static function buildKey(string $group, string $keyName): string
    {
        return $group . '.' . $keyName;
    }

    /**
     * Parse a dot-notation key into [group, keyName].
     */
    public static function parseKey(string $fullKey): array
    {
        $dotPos = strpos($fullKey, '.');
        if ($dotPos === false) {
            return ['general', $fullKey];
        }
        return [substr($fullKey, 0, $dotPos), substr($fullKey, $dotPos + 1)];
    }

    /**
     * Get a metadata value for a project by group and key.
     */
    public static function getValue(int $projectId, string $group, string $keyName): ?string
    {
        return static::where('relation_type', self::RELATION_TYPE)
            ->where('relation_id', $projectId)
            ->where('key', self::buildKey($group, $keyName))
            ->value('value');
    }

    /**
     * Set a metadata value for a project (upsert via UNIQUE index).
     */
    public static function setValue(int $projectId, string $group, string $keyName, ?string $value): self
    {
        return static::updateOrCreate(
            [
                'relation_type' => self::RELATION_TYPE,
                'relation_id' => $projectId,
                'key' => self::buildKey($group, $keyName),
            ],
            [
                'value' => $value,
            ]
        );
    }

    /**
     * Get all metadata for a project as a grouped array.
     * Returns: ['onboarding' => ['company_name' => 'X', 'mrr' => 'Y'], ...]
     */
    public static function getGrouped(int $projectId): array
    {
        $items = static::where('relation_type', self::RELATION_TYPE)
            ->where('relation_id', $projectId)
            ->get();

        $result = [];
        foreach ($items as $item) {
            [$group, $keyName] = self::parseKey($item->key);
            $result[$group][$keyName] = $item->value;
        }

        return $result;
    }

    /**
     * Get metadata for a specific group.
     * Returns: ['company_name' => 'X', 'mrr' => 'Y']
     */
    public static function getGroup(int $projectId, string $group): array
    {
        $items = static::where('relation_type', self::RELATION_TYPE)
            ->where('relation_id', $projectId)
            ->where('key', 'LIKE', $group . '.%')
            ->get();

        $result = [];
        foreach ($items as $item) {
            [, $keyName] = self::parseKey($item->key);
            $result[$keyName] = $item->value;
        }

        return $result;
    }

    /**
     * Batch set multiple values for a group.
     */
    public static function setGroup(int $projectId, string $group, array $data): void
    {
        foreach ($data as $keyName => $value) {
            static::setValue($projectId, $group, $keyName, $value);
        }
    }

    /**
     * Delete a specific key.
     */
    public static function deleteKey(int $projectId, string $group, string $keyName): bool
    {
        return static::where('relation_type', self::RELATION_TYPE)
            ->where('relation_id', $projectId)
            ->where('key', self::buildKey($group, $keyName))
            ->delete() > 0;
    }
}
