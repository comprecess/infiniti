<?php

namespace App\Models\Resident\Project\Template;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectTemplate extends Model
{
    use HasFactory;

    protected $table = 'clx_project_templates';

    protected $fillable = [
        'code',
        'name',
        'description',
        'default_roles',
        'default_statuses',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'default_roles' => 'json',
        'default_statuses' => 'json',
        'is_active' => 'boolean',
    ];

    /**
     * Get all sections for this template.
     */
    public function sections()
    {
        return $this->hasMany(ProjectTemplateSection::class, 'template_id')
            ->where('is_active', true)
            ->orderBy('sort_order');
    }

    /**
     * Get all sections including inactive ones.
     */
    public function allSections()
    {
        return $this->hasMany(ProjectTemplateSection::class, 'template_id')
            ->orderBy('sort_order');
    }

    /**
     * Scope to only active templates.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Find a template by its unique code.
     */
    public static function findByCode(string $code): ?self
    {
        return static::where('code', $code)->first();
    }

    /**
     * Get templates for select dropdown.
     */
    public static function getForSelect()
    {
        return static::active()->orderBy('sort_order')->get(['id', 'code', 'name']);
    }
}
