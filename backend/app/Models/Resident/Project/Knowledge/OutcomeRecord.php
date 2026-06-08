<?php
namespace App\Models\Resident\Project\Knowledge;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Resident\Project\Task;

class OutcomeRecord extends Model
{
    use SoftDeletes;

    protected $table = 'sys_outcome_records';

    protected $fillable = [
        'task_id', 'expected_result', 'actual_result', 'metrics', 'lessons_learned', 'outcome_date'
    ];

    protected $casts = [
        'metrics' => 'json',
        'outcome_date' => 'datetime',
    ];

    public function task()
    {
        return $this->belongsTo(Task::class, 'task_id');
    }
}
