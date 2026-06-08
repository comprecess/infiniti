<?php
namespace App\Models\Resident\Project\Knowledge;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Resident\Project\Task;

class ValidationRecord extends Model
{
    use SoftDeletes;

    protected $table = 'sys_validation_records';

    protected $fillable = [
        'task_id', 'release_id', 'finding', 'severity', 'resolution', 'status'
    ];

    const SEVERITIES = ['Blocker', 'High', 'Medium', 'Low', 'Pass'];
    const STATUSES = ['Open', 'Resolved', 'Ignored'];

    public function task()
    {
        return $this->belongsTo(Task::class, 'task_id');
    }
}
