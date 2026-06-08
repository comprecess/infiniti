<?php
namespace App\Models\Resident\Project\Knowledge;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Resident\Project\Task;

class KnowledgeAsset extends Model
{
    use SoftDeletes;

    protected $table = 'sys_knowledge_assets';

    protected $fillable = [
        'task_id', 'title', 'asset_type', 'content', 'version'
    ];

    const ASSET_TYPES = ['Architecture', 'API Spec', 'ERD', 'UI Mockup', 'Strategy Doc'];

    public function task()
    {
        return $this->belongsTo(Task::class, 'task_id');
    }
}
