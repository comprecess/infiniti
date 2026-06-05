<?php

namespace App\Models\Resident\Project\Template;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectTemplateSection extends Model
{
    use HasFactory;

    protected $table = 'clx_project_template_sections';

    protected $fillable = [
        'template_id',
        'code',
        'name',
        'icon',
        'sort_order',
        'config',
        'is_required',
        'is_active',
    ];

    protected $casts = [
        'config' => 'json',
        'is_required' => 'boolean',
        'is_active' => 'boolean',
    ];

    /**
     * Get the parent template.
     */
    public function template()
    {
        return $this->belongsTo(ProjectTemplate::class, 'template_id');
    }
}
