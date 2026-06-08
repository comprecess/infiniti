<?php
namespace App\Models\Resident\Project\Knowledge;

use Illuminate\Database\Eloquent\Model;
use App\Models\Resident\Project\Task;

class TaskContext extends Model
{
    protected $table = 'sys_task_contexts';

    protected $fillable = [
        'task_id', 'problem_statement', 'business_value', 'success_criteria', 'origin_source'
    ];

    public function task()
    {
        return $this->belongsTo(Task::class, 'task_id');
    }
}
