<?php

namespace App\Models\Resident\Project;


use App\Models\Users\Admin;
use App\Models\Users\Client;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskTime extends Model
{
    use HasFactory;

    protected $table = 'sys_tasks_time';

    protected $casts = [
        'timeDate' => 'datetime:H:i',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    public function task()
    {
        return $this->belongsTo(Task::class, 'task_id');
    }

    public function user()
    {
        return $this->morphTo('user');
    }

    public function setUser(Admin|Client $user)
    {
        $this->user_type = $user::class;
        $this->user_id = $user->id;
    }

    public function setTime(Carbon $time)
    {
        $date = $time->clone();
        $date = $date->setHours(0)->setMinutes(0);
        $this->timeDate = $time->format('H:i');
        $this->time = $time->getTimestamp() - $date->getTimestamp();
    }


}
