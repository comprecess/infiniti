<?php

namespace App\Models\Resident\Project;


use App\Models\Users\Admin;
use App\Models\Users\Client;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;

class TaskTime extends Model
{
    use HasFactory;

    protected $table = 'sys_tasks_time';

    protected $casts = [
        'date' => 'date',
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

    public function setTime(array $time)
    {
        $this->date = Arr::get($time, 'date');
        $this->time = Arr::get($time, 'time');
    }


}
