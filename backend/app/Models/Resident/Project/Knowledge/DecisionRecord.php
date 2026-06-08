<?php
namespace App\Models\Resident\Project\Knowledge;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Resident\Project\Task;

class DecisionRecord extends Model
{
    use SoftDeletes;

    protected $table = 'sys_decision_records';

    protected $fillable = [
        'task_id', 'title', 'context', 'decision', 'alternatives',
        'owner_id', 'decision_date', 'status'
    ];

    protected $casts = [
        'decision_date' => 'datetime',
    ];

    const STATUSES = ['Proposed', 'Accepted', 'Deprecated', 'Superseded'];

    public function task()
    {
        return $this->belongsTo(Task::class, 'task_id');
    }
}
