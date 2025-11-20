<?php

namespace App\Models\Resident\Project;


use App\Http\Resources\Log\ProjectResource;
use App\Http\Resources\Log\TaskResource;
use App\Http\Resources\Log\UserResource;
use App\Models\User;
use App\Models\Users\Admin;
use App\Models\Users\Client;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectLog extends Model
{
    use HasFactory;

    const TYPE = [
        'create',
        'edit',
        'delete',
        'updateStatus',
        'addFile',
        'addExpenses',
        'addInvoices',
        'ganttChart',
        'addTime',
        'editTime',
        'deleteTime',
        'deleteFile'
    ];

    protected $table = 'clx_projects_log';

    protected $casts = [
        'data' => 'array'
    ];

    protected $guarded = [];

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
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

    public function task()
    {
        return $this->belongsTo(Task::class, 'task_id');
    }

    public static function create(Task|Project $model, $type = self::TYPE[0], User $user = null, array $data = null, $description = null, $descriptionDop = null)
    {
        $user = $user ?? User::getAuth();
        $task = null;
        $tag = "project_log.";
        if($model instanceof Task) {
            $task = $model;
            $project = $model->project;
            $tag .= "task";
        }else{
            $project = $model;
            $tag .= "project";
        }

        $description = $description ??  __("{$tag}.{$type}", self::poolingResources([
                'user' => new UserResource($user),
                'project' => new ProjectResource($project),
                'task' => $task ? new TaskResource($task) : null
            ]));

        if($descriptionDop) {
            $description .= $descriptionDop;
        }

        return $user->projectLog()->create([
           'project_id' => $project->id,
           'task_id' => $task?->id,
           'type' => $type,
           'description' => $description,
           'data' => $data
        ]);
    }

    public static function poolingResources(array $data) :array
    {
        $result = [];
        foreach($data as $name => $res){
            if($res instanceof JsonResource) {
                foreach($res->toArray(request()) as $nameRes => $value) {
                    $result[$name . ucfirst(strtolower($nameRes))] = $value;
                }
            }
        }

        return $result;
    }

    public static function dopDescription($name, array $data)
    {
        return __("project_log.{$name}", $data);
    }



}
