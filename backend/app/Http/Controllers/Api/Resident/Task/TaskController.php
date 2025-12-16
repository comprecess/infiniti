<?php


namespace App\Http\Controllers\Api\Resident\Task;


use App\Http\Controllers\Api\Resident\Project\Traits\ProjectLogTrait;
use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Requests\Resident\Task\TaskCreateRequest;
use App\Http\Requests\Resident\Task\TaskUpdateStatusRequest;
use App\Models\Resident\Project\ProjectLog;
use App\Models\Resident\Project\Task;
use App\Models\User;
use App\Models\Users\Admin;
use App\Models\Users\Client;

class TaskController extends TaskAccessController
{
    use ProjectLogTrait, CRUD {
        createOrUpdate as createOrUpdateCRUD;
        delete as deleteCRUD;
    }

    public function createOrUpdate(Task $task, TaskCreateRequest $request)
    {
        $this->setOldModel($task);

        $this->isPut = true;
        if(!$task->id) {
            $task = Task::newDefault();
        }
        $result = $this->createOrUpdateCRUD($request, $task, function($model, $request, $isNew){
            if($isNew) {
                $admin = User::getAuth();
                if($admin instanceof Client) {
                    $model->cid = $admin->id;
                }
            }
            $date = now();
            $model->pid = $model->pid?->id ?? $model->pid;
            $model->started = $request->startDate ?? $date->format('Y-m-d');
            $model->due_date = $request->dueDate ?? null;
        }, function($model, $request, $isNew){
            $model->setPersonal($request->getUsers());
        });
        $this->sendLog($task);

        return $result;
    }

    public function delete(Task $task)
    {
        $this->sendLog($task, ProjectLog::TYPE[2]);
        return $this->deleteCRUD($task);
    }

    public function updateStatus(Task $task, TaskUpdateStatusRequest $request)
    {
        $this->setOldModel($task);
        $tasksRequest = Task::where('status',$request->status)
            ->where('id', '!=', $task->id)
            ->sort();

        if($request->pid) {
            $tasksRequest->where('pid', $request->pid);
        }

        $newPosition = 0;
        foreach($tasksRequest->get() as $position => $taskEach) {
            $position += $newPosition;
            if($position == $request->position) {
                $newPosition++;
                $position += $newPosition;
            }
            $taskEach->position = $position;
            $taskEach->save();
        }

        $task->status = $request->status;
        $task->position = $request->position;
        $task->save();

        $dopDescription = __('project_log.task.updateStatusName',['statusName' => $task->status, 'statusPosition' => $task->position]);
        $this->sendLog($task, ProjectLog::TYPE[3], $dopDescription);

        return $this->defResponse();
    }
}
