<?php
namespace App\Models\Resident\Project\Knowledge;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Resident\Project\Task;

class PromptRecord extends Model
{
    use SoftDeletes;

    protected $table = 'sys_prompt_records';

    protected $fillable = [
        'task_id', 'objective', 'prompt_text', 'output_text',
        'status', 'execution_date'
    ];

    protected $casts = [
        'execution_date' => 'datetime',
    ];

    const STATUSES = ['Success', 'Partial', 'Failed'];

    public function task()
    {
        return $this->belongsTo(Task::class, 'task_id');
    }
}
